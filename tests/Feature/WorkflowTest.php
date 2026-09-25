<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class WorkflowTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['email.cache_store' => 'array']);
    }

    public function test_workspace_exposes_the_brief_build_and_review_workflow(): void
    {
        $this->get('/')->assertSee('Build workflow')->assertSee('Prepare a brief');
        $this->get('/new-email?brand=sanecotec&recipe=newsletter')->assertSee('SanEcoTec')->assertSee('Generate build prompt');
        $this->get('/drafts')->assertSee('Builds')->assertSee('local agent');
    }

    public function test_brief_generates_a_brand_specific_prompt_without_writing_source(): void
    {
        $this->post('/new-email', $this->brief())
            ->assertSee('Copy build prompt')->assertSee('email-engine/drafts/workflow-test-email.json')
            ->assertSee('email-engine/brands/sanecotec/')->assertSee('npm run email:check -- workflow-test-email');

        $this->assertFileDoesNotExist(base_path('email-engine/drafts/workflow-test-email.json'));
    }

    #[DataProvider('invalidBriefs')]
    public function test_invalid_brief_returns_422(string $field, mixed $value): void
    {
        $this->postJson('/new-email', array_replace($this->brief(), [$field => $value]))
            ->assertUnprocessable()->assertJsonValidationErrors($field);
    }

    public static function invalidBriefs(): array
    {
        return [
            'path traversal' => ['slug', '../test'],
            'unknown brand' => ['brand', 'other-company'],
            'unknown recipe' => ['recipe', 'missing'],
            'unknown style' => ['theme', 'missing'],
            'missing goal' => ['objective', ''],
            'executable URL' => ['cta_url', 'javascript:alert(1)'],
        ];
    }

    public function test_generated_prompt_escapes_brief_content(): void
    {
        $this->post('/new-email', array_replace($this->brief(), ['content' => '</textarea><script>alert(1)</script>']))
            ->assertSee('&lt;/textarea&gt;', false)->assertDontSee('<script>alert(1)</script>', false);
    }

    public function test_brand_collection_uses_the_workspace_and_preserves_composition_actions(): void
    {
        $this->get('/brands/sanecotec?kind=blocks&theme=editorial')->assertSee('48 designs')->assertSee('New email for this brand');
        $this->get('/brand-designs/sanecotec/emails/welcome?theme=minimal')->assertSee('Copy composition')->assertSee('Download HTML')->assertSee('Draft review');
    }

    public function test_agent_output_is_discovered_validated_and_exported(): void
    {
        $path = base_path('email-engine/drafts/workflow-test-built-email.json');
        $this->assertFileDoesNotExist($path);
        file_put_contents($path, json_encode(['title' => 'Workflow test email', 'brand' => 'placeholder', 'theme' => 'minimal', 'nodes' => [
            ['component' => 'email/header'], ['component' => 'hero/text-only', 'data' => ['headline' => 'A verified local build']], ['component' => 'email/footer'],
        ]], JSON_THROW_ON_ERROR));

        try {
            $this->get('/drafts')->assertSee('Workflow test email');
            $this->get('/builds/workflow-test-built-email')->assertSee('Checks passed');
            $this->get('/frame/draft/workflow-test-built-email?download=1')->assertDownload('workflow-test-built-email-minimal.html')
                ->assertSee('A verified local build')->assertSee('{% unsubscribe_link %}', false)->assertDontSee('<script', false);
            $this->postJson('/new-email', array_replace($this->brief(), ['slug' => 'workflow-test-built-email']))->assertUnprocessable()->assertJsonValidationErrors('slug');
        } finally {
            unlink($path);
        }
    }

    public function test_malformed_build_stays_discoverable_and_cannot_be_downloaded(): void
    {
        $path = base_path('email-engine/drafts/workflow-test-malformed.json');
        $this->assertFileDoesNotExist($path);
        file_put_contents($path, '{ invalid json');

        try {
            $this->get('/drafts')->assertSee('workflow-test-malformed')->assertSee('Needs attention');
            $this->get('/builds/workflow-test-malformed')->assertSee('This build needs a fix')->assertDontSee('Download HTML');
            $this->getJson('/frame/draft/workflow-test-malformed?download=1')->assertUnprocessable();
        } finally {
            unlink($path);
        }
    }

    private function brief(): array
    {
        return [
            'name' => 'Monitoring update', 'slug' => 'workflow-test-email', 'brand' => 'sanecotec',
            'recipe' => 'newsletter', 'theme' => 'minimal', 'audience' => 'Existing customers',
            'objective' => 'Introduce the monitoring platform.', 'content' => 'Use only the existing SanEcoTec research.',
            'cta_url' => 'https://sanecotec.com/about/contact',
        ];
    }
}

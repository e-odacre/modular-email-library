<?php

namespace Tests\Feature;

use App\Services\EmailEngine;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\Facades\Process;
use Laravel\Boost\Middleware\InjectBoost;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EmailStudioTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['email.cache_store' => 'array']);
    }

    public function test_libraries_discover_the_migrated_designs(): void
    {
        $this->get('/components?theme=editorial')->assertSee('116 designs')->assertSee('content/button');
        $this->get('/recipes')->assertSee('12 designs');
        $this->get('/emails')->assertSee('3 designs');
        $this->get('/brands')->assertSee('SanEcoTec')->assertSee('48 blocks');
    }

    public function test_design_pages_offer_styles_variants_and_clean_downloads(): void
    {
        $this->get('/flows/welcome?theme=bold')->assertSee('Download HTML')->assertSee('theme=bold');
        $this->get('/recipes/welcome')->assertSee('Download HTML');
        $this->get('/components/content/button?theme=editorial')->assertSee('Outline')->assertSee('variant=outline')->assertSee('Component fields and settings');
    }

    public function test_download_preserves_klaviyo_tags_without_workspace_markup(): void
    {
        $this->app->make(Kernel::class)->appendMiddlewareToGroup('web', InjectBoost::class);
        $this->get('/')->assertSee('browser-logger-active', false);

        $this->get('/frame/email/flows/welcome?download=1')
            ->assertDownload('flows-welcome-minimal.html')
            ->assertSee('{{ organization.full_address }}', false)
            ->assertSee('{% unsubscribe_link %}', false)
            ->assertDontSee('EventSource', false)
            ->assertDontSee('studio.js', false)
            ->assertDontSee('<script', false)
            ->assertHeader('Content-Security-Policy', "sandbox allow-same-origin; script-src 'none'");
    }

    public function test_placeholder_production_download_returns_422(): void
    {
        $this->getJson('/frame/email/flows/welcome?download=1&mode=production')
            ->assertUnprocessable()->assertJsonPath('message', 'Production export requires complete real brand tokens. ');
    }

    #[DataProvider('missingDesigns')]
    public function test_unknown_design_or_source_file_returns_404(string $url): void
    {
        $this->get($url)->assertNotFound();
    }

    public static function missingDesigns(): array
    {
        return [
            ['/recipes/unknown'], ['/frame/email/flows/missing'],
            ['/components/content/missing'], ['/studio/bridge.js'],
            ['/brands/sanecotec/catalog.js'], ['/brands/unknown/index.html'],
            ['/frame/component/content/../../tokens/placeholder'],
        ];
    }

    public function test_invalid_style_and_variant_return_actionable_422(): void
    {
        $this->getJson('/emails?theme=missing')->assertUnprocessable()->assertJsonPath('message', 'Unknown style.');
        $this->getJson('/frame/component/content/button?variant=missing')->assertUnprocessable()->assertJsonPath('message', 'Unknown component variant.');
        $this->getJson('/frame/email/flows/welcome?theme[]=minimal')->assertUnprocessable()->assertJsonPath('message', 'Invalid theme.');
    }

    public function test_engine_failure_returns_503_with_setup_guidance(): void
    {
        Process::fake([Process::result(errorOutput: 'node not found', exitCode: 127)]);

        $this->getJson('/')->assertServiceUnavailable()->assertJsonPath('message', 'Email engine unavailable. Check EMAIL_NODE_BINARY and run npm ci --prefix email-engine.');

        Process::assertRan(fn ($process) => $process->command[1] === 'scripts/bridge.js');
    }

    public function test_preview_cache_separates_themes_and_reuses_identical_requests(): void
    {
        Process::fake(fn ($process) => Process::result(output: json_encode([
            'ok' => true, 'data' => ['html' => json_decode($process->input, true)['theme']],
        ])));
        $engine = app(EmailEngine::class);
        $request = ['operation' => 'render', 'kind' => 'email', 'id' => 'flows/welcome', 'theme' => 'minimal'];

        $this->assertSame('minimal', $engine->request($request)['html']);
        $this->assertSame('minimal', $engine->request($request)['html']);
        $request['theme'] = 'bold';
        $this->assertSame('bold', $engine->request($request)['html']);

        Process::assertRanTimes(fn ($process) => $process->command[1] === 'scripts/bridge.js', 2);
    }

    public function test_process_exception_returns_503_with_runtime_guidance(): void
    {
        Process::fake(fn () => throw new \RuntimeException('process timed out'));

        $this->getJson('/')->assertServiceUnavailable()
            ->assertJsonPath('message', 'Email rendering could not finish. Check the Node runtime and EMAIL_RENDER_TIMEOUT.');
    }

    public function test_source_changes_invalidate_cached_previews(): void
    {
        $fixture = storage_path('framework/testing/email-engine-cache');
        if (! is_dir($fixture)) {
            mkdir($fixture, 0777, true);
        }
        file_put_contents($fixture.'/template.njk', 'before');
        config(['email.engine_path' => $fixture]);
        Process::fake(fn () => Process::result(output: json_encode([
            'ok' => true, 'data' => ['html' => file_get_contents($fixture.'/template.njk')],
        ])));
        $engine = app(EmailEngine::class);
        $request = ['operation' => 'render', 'kind' => 'email', 'id' => 'flows/welcome'];

        try {
            $this->assertSame('before', $engine->request($request)['html']);
            file_put_contents($fixture.'/template.njk', 'after');
            $this->assertSame('after', $engine->request($request)['html']);
            Process::assertRanTimes(fn ($process) => $process->command[1] === 'scripts/bridge.js', 2);
        } finally {
            unlink($fixture.'/template.njk');
            rmdir($fixture);
        }
    }

    public function test_collection_gallery_preserves_compositions_styles_and_draft_notes(): void
    {
        $this->app->make(Kernel::class)->appendMiddlewareToGroup('web', InjectBoost::class);
        $response = $this->get('/brands/sanecotec/index.html');
        $response->assertSee('SanEcoTec')->assertSee('Copy composition')->assertSee('Draft notes and brand values')->assertSee('Email library');
        $manifest = $this->getJson('/brands/sanecotec/manifest.json')->assertJsonCount(60, 'entries')->json();
        $this->assertSame(['minimal', 'editorial', 'bold'], $manifest['themes']);
        $block = collect($manifest['entries'])->firstWhere('kind', 'blocks');
        $email = collect($manifest['entries'])->firstWhere('kind', 'emails');
        $this->assertArrayHasKey('nodes', $block['composition']);
        $this->assertArrayNotHasKey('blockIds', $block['composition']);
        $this->assertArrayHasKey('blockIds', $email['composition']);

        $this->get('/brands/sanecotec/'.$email['previews']['minimal']['href'])
            ->assertSee('{{ organization.full_address }}', false)->assertDontSee('<script', false);
    }
}

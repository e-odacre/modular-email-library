<?php

namespace App\Http\Controllers;

use App\Services\EmailEngine;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class StudioController extends Controller
{
    public function __construct(private EmailEngine $engine) {}

    public function index(Request $request, string $library = 'overview'): View
    {
        $inventory = $this->engine->request(['operation' => 'inventory']);
        $theme = $this->theme($request, $inventory);
        $entries = $inventory[$library] ?? [];

        return view('studio.index', compact('inventory', 'theme', 'library', 'entries'));
    }

    public function test(): View
    {
        return view('test');
    }

    public function show(Request $request, string $id, string $kind): View
    {
        $inventory = $this->engine->request(['operation' => 'inventory']);
        $library = ['email' => 'emails', 'recipe' => 'recipes', 'component' => 'components'][$kind];
        $entry = collect($inventory[$library])->firstWhere('id', $id);
        abort_unless($entry, 404, 'Design not found.');
        $theme = $this->theme($request, $inventory);
        $result = $this->engine->request($this->renderRequest($request, $kind, $id));

        return view('studio.show', compact('inventory', 'theme', 'library', 'entry', 'kind', 'result'));
    }

    public function frame(Request $request, string $kind, string $id): Response
    {
        $result = $this->engine->request($this->renderRequest($request, $kind, $id));
        abort_if(count($result['diagnostics']['errors']) > 0, 422, implode('\n', $result['diagnostics']['errors']));
        $headers = [
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store',
            'Content-Security-Policy' => "sandbox allow-same-origin; script-src 'none'",
        ];
        if ($request->boolean('download')) {
            $headers['Content-Disposition'] = 'attachment; filename="'.Str::slug(str_replace('/', '-', $id).'-'.$result['theme']).'.html"';
        }

        return response($result['html'], 200, $headers);
    }

    public function asset(string $asset): Response
    {
        $paths = [
            'gallery.css' => config('email.engine_path').'/scripts/gallery/gallery.css',
            'studio.css' => config('email.engine_path').'/scripts/gallery/studio.css',
            'studio.js' => config('email.engine_path').'/scripts/gallery/studio.js',
            'workspace.css' => resource_path('css/workspace.css'),
            'workspace.js' => resource_path('js/workspace.js'),
        ];
        abort_unless(isset($paths[$asset]), 404);

        return response(file_get_contents($paths[$asset]), 200, [
            'Content-Type' => str_ends_with($asset, '.css') ? 'text/css; charset=UTF-8' : 'text/javascript; charset=UTF-8',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-cache',
        ]);
    }

    public function revision(): JsonResponse
    {
        return response()->json(['revision' => $this->engine->revision()])->header('Cache-Control', 'no-store');
    }

    public function collection(string $brand, string $artifact = 'index.html'): Response
    {
        abort_unless(preg_match('/\A(?:index\.html|gallery\.(?:css|js)|manifest\.json|[a-z0-9-]+\/(?:blocks|emails)\/[a-z0-9-]+\.html)\z/', $artifact), 404);
        $inventory = $this->engine->request(['operation' => 'inventory']);
        abort_unless(collect($inventory['collections'])->contains('id', $brand), 404);
        $content = $this->engine->gallery($brand, $artifact);
        $extension = pathinfo($artifact, PATHINFO_EXTENSION);

        if ($artifact === 'index.html') {
            $back = '<a href="'.e(route('studio.library', ['library' => 'brands'])).'">← Email library</a>';
            $content = str_replace('<span class="draft-pill">', $back.'<span class="draft-pill">', $content);
        }

        return response($content, 200, [
            'Content-Type' => ['html' => 'text/html', 'css' => 'text/css', 'js' => 'text/javascript', 'json' => 'application/json'][$extension].'; charset=UTF-8',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store',
        ]);
    }

    private function theme(Request $request, array $inventory): string
    {
        $theme = $request->query('theme', 'minimal');
        abort_unless(is_string($theme) && in_array($theme, $inventory['themes'], true), 422, 'Unknown style.');

        return $theme;
    }

    private function renderRequest(Request $request, string $kind, string $id): array
    {
        $input = ['operation' => 'render', 'kind' => $kind, 'id' => $id];
        foreach (['theme', 'variant', 'mode'] as $key) {
            if ($request->has($key)) {
                abort_unless(is_string($request->query($key)), 422, 'Invalid '.$key.'.');
                $input[$key] = $request->query($key);
            }
        }

        return $input;
    }
}

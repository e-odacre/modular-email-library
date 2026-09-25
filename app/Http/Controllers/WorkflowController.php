<?php

namespace App\Http\Controllers;

use App\Services\EmailBuildPrompt;
use App\Services\EmailEngine;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WorkflowController extends Controller
{
    public function __construct(private EmailEngine $engine, private EmailBuildPrompt $prompts) {}

    public function create(Request $request): View
    {
        $inventory = $this->engine->request(['operation' => 'inventory']);
        $brief = [
            'brand' => is_string($request->query('brand')) ? $request->query('brand') : 'placeholder',
            'recipe' => is_string($request->query('recipe')) ? $request->query('recipe') : 'welcome',
            'theme' => is_string($request->query('theme')) ? $request->query('theme') : 'minimal',
        ];

        return view('studio.workflow', ['inventory' => $inventory, 'library' => 'workflow', 'theme' => 'minimal', 'brief' => $brief, 'prompt' => null]);
    }

    public function store(Request $request): View
    {
        $inventory = $this->engine->request(['operation' => 'inventory']);
        $brief = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:80', 'regex:/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/', Rule::notIn(array_column($inventory['drafts'], 'id'))],
            'brand' => ['required', 'string', Rule::in(array_merge($inventory['brands'], array_column($inventory['collections'], 'id')))],
            'recipe' => ['required', 'string', Rule::in(array_column($inventory['recipes'], 'id'))],
            'theme' => ['required', 'string', Rule::in($inventory['themes'])],
            'audience' => ['required', 'string', 'max:500'],
            'objective' => ['required', 'string', 'max:2000'],
            'content' => ['required', 'string', 'max:6000'],
            'cta_url' => ['nullable', 'url:http,https', 'max:2000'],
        ], [
            'slug.not_in' => 'A build already uses this ID. Choose a new ID to keep its source intact.',
            'slug.regex' => 'Use lowercase letters, numbers, and single hyphens for the build ID.',
        ]);

        return view('studio.workflow', ['inventory' => $inventory, 'library' => 'workflow', 'theme' => $brief['theme'], 'brief' => $brief, 'prompt' => $this->prompts->generate($brief)]);
    }
}

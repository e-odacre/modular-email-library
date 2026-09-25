@extends('studio.layout')
@section('title', ucfirst($entry['name']))
@section('content')
@php
    $back = $back ?? route('studio.library', ['library' => $library, 'theme' => $theme]);
    $variant = $kind === 'component' ? request('variant', array_key_first($entry['variants'])) : null;
    $frame = $frame ?? route('studio.frame', array_filter(['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme, 'variant' => $variant]));
    $hasErrors = count($result['diagnostics']['errors']) > 0;
@endphp
<a class="link link-hover text-xs text-base-content/50" href="{{ $back }}">← {{ $library === 'drafts' ? 'Builds' : ucfirst($library) }}</a>
<div class="flex flex-wrap items-start justify-between gap-4"><div><div class="flex flex-wrap items-center gap-3"><h1 class="text-2xl font-semibold tracking-tight">{{ ucfirst($entry['name']) }}</h1><span class="badge badge-outline badge-sm {{ $hasErrors ? 'badge-error' : 'badge-success' }}">{{ $hasErrors ? 'Needs attention' : 'Checks passed' }}</span></div><p class="mt-2 max-w-2xl text-sm text-base-content/60">{{ $entry['description'] }}</p></div>
@if($kind === 'recipe')<a class="btn btn-primary btn-sm" href="{{ route('workflow.create', ['recipe' => $entry['id'], 'theme' => $theme]) }}">Use this recipe</a>@endif</div>
<section data-preview class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
    <div class="min-w-0 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-base-300 bg-base-100 p-3"><div class="join" aria-label="Preview width"><button class="btn btn-sm join-item btn-active" data-width="600" aria-pressed="true">Desktop · 600</button><button class="btn btn-sm join-item" data-width="375" aria-pressed="false">Phone · 375</button></div>@include('studio.style')</div>
        @if($kind === 'component')
            <div class="flex flex-wrap gap-2" aria-label="Component variants">@foreach($entry['variants'] as $name => $definition)<a class="btn btn-xs {{ $variant === $name ? 'btn-primary' : 'btn-outline' }}" @if($variant === $name) aria-current="true" @endif href="{{ route('studio.component', ['id' => $entry['id'], 'theme' => $theme, 'variant' => $name]) }}">{{ ucwords(str_replace('-', ' ', $name)) }}</a>@endforeach</div>
        @endif
        @if(!$hasErrors)
            <div class="preview-stage"><iframe class="email-preview" src="{{ $frame }}" title="{{ $entry['name'] }} preview" sandbox="allow-same-origin" width="600"></iframe></div>
        @else
            <div class="rounded-xl border border-error/30 bg-error/5 p-8"><h2 class="font-semibold">This build needs a fix before preview or export.</h2><p class="mt-2 text-sm text-base-content/60">Use the diagnostics to update the source, then reload this page.</p></div>
        @endif
    </div>
    <aside class="space-y-4">
        <div class="card border border-base-300 bg-base-100"><div class="card-body gap-4 p-5"><h2 class="text-sm font-semibold">Review & export</h2><dl class="space-y-3 text-xs"><div class="flex justify-between gap-2"><dt class="text-base-content/50">Brand</dt><dd>{{ $result['brand'] }}</dd></div><div class="flex justify-between"><dt class="text-base-content/50">HTML size</dt><dd>{{ number_format($result['bytes'] / 1024, 1) }} KB</dd></div><div class="flex justify-between"><dt class="text-base-content/50">Stage</dt><dd>Draft review</dd></div></dl>
        @if(!$hasErrors)<a class="btn btn-primary btn-sm" href="{{ $frame }}{{ str_contains($frame, '?') ? '&' : '?' }}download=1" download="{{ $entry['id'] }}.html">Download HTML</a><a class="btn btn-outline btn-sm" href="{{ $frame }}" target="_blank" rel="noopener">Open HTML ↗</a>@endif
        <p class="text-xs leading-relaxed text-base-content/45">Compilation checks do not replace copy approval or inbox testing.</p></div></div>
        <div class="card border border-base-300 bg-base-100"><div class="card-body gap-3 p-5"><h2 class="text-sm font-semibold">Preview diagnostics</h2>
        @if(!$result['diagnostics']['errors'] && !$result['diagnostics']['warnings'])<p class="text-xs text-success">No renderer errors or warnings.</p>@endif
        @foreach($result['diagnostics']['errors'] as $message)<p class="break-words text-xs leading-relaxed text-error">{{ $message }}</p>@endforeach
        @foreach($result['diagnostics']['warnings'] as $message)<p class="break-words text-xs leading-relaxed text-warning">{{ $message }}</p>@endforeach
        </div></div>
        @if($kind === 'draft')<div class="rounded-xl border border-base-300 p-4"><p class="text-xs font-medium">Source file</p><code class="mt-2 block break-all text-xs text-base-content/60">email-engine/drafts/{{ $entry['id'] }}.json</code></div>@endif
    </aside>
</section>
@if($kind === 'component')
<details class="rounded-xl border border-base-300 bg-base-100 p-5"><summary class="text-sm font-medium">Component fields and settings</summary><div class="mt-4 space-y-2 text-xs text-base-content/60"><p>Component: <code>{{ $entry['id'] }}</code></p><p>Fields: {{ implode(', ', array_keys($entry['fields'])) }}</p><p>Settings: {{ implode(', ', array_keys($entry['settings'])) }}</p></div></details>
@endif
@isset($result['composition'])
<details class="rounded-xl border border-base-300 bg-base-100 p-5"><summary class="text-sm font-medium">Composition and sources</summary><div class="mt-4 space-y-4"><p class="text-xs text-base-content/60">Standalone blocks include a frame in the preview. The copied composition contains only the selected block.</p><textarea id="composition" class="textarea w-full font-mono text-xs" rows="10" readonly aria-label="Reusable composition">{{ json_encode($result['composition'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) }}</textarea><button type="button" class="btn btn-outline btn-sm" data-copy-target="composition">Copy composition</button><div class="flex flex-col gap-2">@foreach($result['sources'] as $source)<a class="link link-primary break-all text-xs" href="{{ $source }}" target="_blank" rel="noopener">{{ $source }}</a>@endforeach</div></div></details>
@endisset
@endsection

@extends('studio.layout')
@section('title', 'Build brief')
@section('content')
<div class="flex flex-wrap items-center justify-between gap-4"><div><h1 class="text-2xl font-semibold tracking-tight">New email</h1><p class="mt-1 text-sm text-base-content/60">Turn a clear brief into a repeatable build.</p></div><a class="btn btn-ghost btn-sm" href="{{ route('studio.library', 'drafts') }}">View builds →</a></div>
<ol class="steps steps-vertical sm:steps-horizontal w-full max-w-2xl text-xs"><li class="step step-primary">Prepare brief</li><li class="step {{ $prompt ? 'step-primary' : '' }}">Copy build prompt</li><li class="step">Review build</li><li class="step">Export HTML</li></ol>
<div class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
    <form action="{{ route('workflow.store') }}" method="post" class="space-y-5" data-brief-form data-restore="{{ !$prompt && !$errors->any() ? 'true' : 'false' }}">
        @csrf
        <section class="card border border-base-300 bg-base-100"><div class="card-body gap-5 p-6"><div><h2 class="text-base font-semibold">Starting point</h2><p class="mt-1 text-xs text-base-content/50">Use existing brand content and a proven email structure.</p></div>
            <div class="grid gap-4 sm:grid-cols-2">
                <label class="text-xs font-medium">Email name<input class="input mt-2 w-full" name="name" value="{{ old('name', $brief['name'] ?? '') }}" placeholder="September product update" required maxlength="120">@error('name')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
                <label class="text-xs font-medium">Build ID<input class="input mt-2 w-full font-mono text-sm" name="slug" value="{{ old('slug', $brief['slug'] ?? '') }}" placeholder="september-product-update" required maxlength="80" pattern="[a-z0-9]+(-[a-z0-9]+)*"><span class="mt-1 block text-[11px] font-normal text-base-content/45">A unique name for this build’s source file.</span>@error('slug')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
                <label class="text-xs font-medium">Brand<select class="select mt-2 w-full" name="brand" required>@foreach($inventory['brands'] as $brand)<option value="{{ $brand }}" @selected(old('brand', $brief['brand']) === $brand)>{{ $brand === 'placeholder' ? 'Placeholder / examples' : ucfirst($brand) }}</option>@endforeach @foreach($inventory['collections'] as $collection)<option value="{{ $collection['id'] }}" @selected(old('brand', $brief['brand']) === $collection['id'])>{{ $collection['name'] }} · draft</option>@endforeach</select></label>
                <label class="text-xs font-medium">Recipe<select class="select mt-2 w-full" name="recipe" required>@foreach($inventory['recipes'] as $recipe)<option value="{{ $recipe['id'] }}" @selected(old('recipe', $brief['recipe']) === $recipe['id'])>{{ $recipe['name'] }}</option>@endforeach</select></label>
                <label class="text-xs font-medium">Email style<select class="select mt-2 w-full" name="theme" required>@foreach($inventory['themes'] as $option)<option value="{{ $option }}" @selected(old('theme', $brief['theme']) === $option)>{{ ucwords(str_replace('-', ' ', $option)) }}</option>@endforeach</select></label>
            </div>
        </div></section>
        <section class="card border border-base-300 bg-base-100"><div class="card-body gap-5 p-6"><h2 class="text-base font-semibold">Content brief</h2>
            <label class="text-xs font-medium">Audience<input class="input mt-2 w-full" name="audience" value="{{ old('audience', $brief['audience'] ?? '') }}" placeholder="Existing customers using the monitoring platform" required maxlength="500">@error('audience')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
            <label class="text-xs font-medium">What should this email achieve?<textarea class="textarea mt-2 w-full" name="objective" rows="3" placeholder="Explain the update and invite readers to book a walkthrough." required maxlength="2000">{{ old('objective', $brief['objective'] ?? '') }}</textarea>@error('objective')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
            <label class="text-xs font-medium">Approved content, references, and constraints<textarea class="textarea mt-2 w-full" name="content" rows="6" placeholder="Include the facts, copy, links, and image references the agent can use. Note anything that must stay unchanged." required maxlength="6000">{{ old('content', $brief['content'] ?? '') }}</textarea>@error('content')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
            <label class="text-xs font-medium">Primary CTA destination <span class="font-normal text-base-content/45">(optional)</span><input class="input mt-2 w-full" name="cta_url" type="url" value="{{ old('cta_url', $brief['cta_url'] ?? '') }}" placeholder="https://…" maxlength="2000">@error('cta_url')<span class="mt-1 block text-error">{{ $message }}</span>@enderror</label>
        </div></section>
        <div class="flex flex-wrap items-center gap-3"><button type="submit" class="btn btn-primary">{{ $prompt ? 'Regenerate prompt' : 'Generate build prompt' }}</button><button type="button" class="btn btn-ghost" data-reset-brief>Start a new brief</button><span class="text-xs text-base-content/45" data-brief-status role="status">Brief stays in this browser</span></div>
    </form>
    <aside class="space-y-5 xl:sticky xl:top-24">
        <div class="card border border-base-300 bg-base-100"><div class="card-body gap-4 p-5"><div class="flex items-center justify-between"><h2 class="font-semibold">Agent handoff</h2><span class="badge badge-outline badge-sm">{{ $prompt ? 'Prepared' : 'Not prepared' }}</span></div>
        @if($prompt)
            <p class="text-xs leading-relaxed text-base-content/60">Run your local coding agent in this project and give it this prompt. The app prepares the instructions; the agent creates the email.</p>
            <textarea id="build-prompt" class="textarea h-64 w-full font-mono text-xs" readonly aria-label="Generated build prompt">{{ $prompt }}</textarea>
            <button class="btn btn-primary btn-sm" type="button" data-copy-target="build-prompt">Copy build prompt</button><button class="btn btn-outline btn-sm" type="button" data-download-target="build-prompt" data-filename="build-{{ $brief['slug'] }}.md">Download prompt</button>
            <div class="border-t border-base-300 pt-4"><p class="text-xs font-medium">Expected output</p><code class="mt-2 block break-all text-xs text-base-content/60">email-engine/drafts/{{ $brief['slug'] }}.json</code><a class="btn btn-ghost btn-sm mt-3" href="{{ route('studio.library', 'drafts') }}">Check builds →</a></div>
        @else
            <p class="text-sm leading-relaxed text-base-content/60">Complete the brief to generate instructions tailored to the selected brand, recipe, and email style.</p>
            <div class="rounded-lg bg-base-200 p-4"><p class="text-xs font-medium">Included automatically</p><ul class="mt-3 space-y-2 text-xs text-base-content/55"><li>✓ Brand context and source references</li><li>✓ Existing components and recipe contract</li><li>✓ Output location and validation command</li><li>✓ Klaviyo and export requirements</li></ul></div>
        @endif
        </div></div>
        <div class="rounded-xl border border-base-300 p-5"><h3 class="text-xs font-semibold">After the agent finishes</h3><p class="mt-2 text-xs leading-relaxed text-base-content/55">The new email appears in Builds. Open it to check the rendered output, review any draft warnings, and download the HTML.</p></div>
    </aside>
</div>
@endsection

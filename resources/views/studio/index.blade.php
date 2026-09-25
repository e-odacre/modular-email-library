@extends('studio.layout')
@section('title', ['overview' => 'Overview', 'drafts' => 'Builds'][$library] ?? ucfirst($library))
@section('content')
@if ($library === 'overview')
    <div class="flex flex-wrap items-center justify-between gap-4"><div><h1 class="text-2xl font-semibold tracking-tight">Email workspace</h1><p class="mt-1 text-sm text-base-content/60">Prepare a brief. Build from your library. Review before you export.</p></div><a class="btn btn-primary btn-sm" href="{{ route('workflow.create') }}">+ New email</a></div>
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
        @foreach (['drafts' => ['Builds', 'Local agent output'], 'recipes' => ['Recipes', 'Complete starting points'], 'components' => ['Components', 'Reusable email blocks'], 'brands' => ['Brands', 'Isolated collections']] as $destination => [$label, $hint])
            <a class="card border border-base-300 bg-base-100 transition-colors hover:border-primary/50" href="{{ route('studio.library', ['library' => $destination]) }}"><div class="card-body gap-2 p-5"><p class="text-xs text-base-content/60">{{ $label }}</p><p class="text-3xl font-semibold tracking-tight">{{ count($inventory[$destination === 'brands' ? 'collections' : $destination]) }}</p><p class="text-xs text-base-content/40">{{ $hint }}</p></div></a>
        @endforeach
    </div>
    <div class="grid gap-6 xl:grid-cols-3">
        <section class="card border border-base-300 bg-base-100 xl:col-span-2"><div class="card-body gap-5 p-6"><div class="flex items-center justify-between"><h2 class="font-semibold">Build workflow</h2><span class="badge badge-outline badge-sm">Local agent</span></div><div class="grid gap-5 sm:grid-cols-3">
        @foreach (['Prepare' => 'Choose a brand and recipe, then write the audience, goal, and content.', 'Build' => 'Copy the generated prompt into your local coding agent.', 'Review & export' => 'Open the discovered build, check warnings, and download HTML.'] as $step => $description)
            <div><span class="mb-3 flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{{ $loop->iteration }}</span><h3 class="text-sm font-medium">{{ $step }}</h3><p class="mt-2 text-xs leading-relaxed text-base-content/60">{{ $description }}</p></div>
        @endforeach
        </div><div class="border-t border-base-300 pt-4"><a href="{{ route('workflow.create') }}" class="btn btn-primary btn-sm">Prepare a brief</a><a href="{{ route('studio.library', 'recipes') }}" class="btn btn-ghost btn-sm">Browse recipes →</a></div></div></section>
        <section class="card border border-base-300 bg-base-100"><div class="card-body gap-4 p-6"><h2 class="font-semibold">Brand collections</h2>
        @foreach($inventory['collections'] as $collection)
            <a href="{{ route('studio.collection', $collection['id']) }}" class="rounded-lg border border-base-300 p-4 hover:border-primary/50"><div class="flex items-center justify-between gap-2"><span class="text-sm font-medium">{{ $collection['name'] }}</span><span class="badge badge-warning badge-outline badge-xs">Draft</span></div><p class="mt-2 text-xs text-base-content/50">{{ $collection['blocks'] }} blocks · {{ $collection['emails'] }} emails</p></a>
        @endforeach
        </div></section>
    </div>
    <section class="card border border-base-300 bg-base-100"><div class="card-body p-6"><div class="flex items-center justify-between"><h2 class="font-semibold">Builds to review</h2><a class="link link-hover text-xs text-base-content/60" href="{{ route('studio.library', 'drafts') }}">View all →</a></div>
    @if(count($inventory['drafts']))
        <div class="divide-y divide-base-300">@foreach(array_slice($inventory['drafts'], 0, 5) as $draft)<a href="{{ route('studio.draft', $draft['id']) }}" class="flex items-center justify-between gap-4 py-4 text-sm"><span>{{ $draft['name'] }}</span><span class="badge badge-outline badge-sm">{{ $draft['state'] === 'invalid' ? 'Needs attention' : 'Needs review' }}</span></a>@endforeach</div>
    @else
        <div class="py-8 text-center"><p class="text-sm font-medium">No builds yet</p><p class="mx-auto mt-2 max-w-md text-sm text-base-content/50">Start with a brief. Emails created by your local agent will appear here automatically.</p><a class="btn btn-outline btn-sm mt-4" href="{{ route('workflow.create') }}">Create your first brief</a></div>
    @endif
    </div></section>
@elseif ($library === 'brands')
    <div><h1 class="text-2xl font-semibold">Brands</h1><p class="mt-1 text-sm text-base-content/60">Brand content, reusable blocks, and draft values in one place.</p></div>
    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    @foreach($inventory['collections'] as $collection)
        <article class="card border border-base-300 bg-base-100"><div class="card-body gap-4 p-6"><div class="flex items-center justify-between"><span class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">{{ mb_substr($collection['name'], 0, 1) }}</span><span class="badge badge-warning badge-outline badge-sm">Draft collection</span></div><div><h2 class="text-lg font-semibold">{{ $collection['name'] }}</h2><p class="mt-2 text-sm leading-relaxed text-base-content/60">{{ $collection['description'] }}</p></div><p class="text-xs text-base-content/50">{{ $collection['blocks'] }} blocks · {{ $collection['emails'] }} emails · {{ count($collection['themes']) }} styles</p><div class="card-actions border-t border-base-300 pt-4"><a class="btn btn-primary btn-sm" href="{{ route('studio.collection', $collection['id']) }}">Open collection</a><a class="btn btn-ghost btn-sm" href="{{ route('workflow.create', ['brand' => $collection['id']]) }}">New email</a></div></div></article>
    @endforeach
    </div>
@else
    <div class="flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-2xl font-semibold">{{ $library === 'drafts' ? 'Builds' : ucfirst($library) }}</h1><p class="mt-1 text-sm text-base-content/60">{{ ['drafts' => 'Generated emails from your local agent. Open a build to run checks and review it.', 'emails' => 'Complete emails and examples, ready to inspect.', 'recipes' => 'Choose a starting point for your next build.', 'components' => 'Find reusable blocks and compare their variants.'][$library] }}</p></div>@if($library === 'drafts')<a class="btn btn-primary btn-sm" href="{{ route('workflow.create') }}">+ New email</a>@endif</div>
    @include('studio.library')
@endif
@endsection
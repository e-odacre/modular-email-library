<!doctype html>
<html lang="en" data-theme="dim">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Overview') / Modular</title>
    <script>try { const theme = localStorage.getItem('modular-ui-theme'); if (['dim', 'light'].includes(theme)) document.documentElement.dataset.theme = theme; } catch {}</script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-base-200 text-base-content antialiased" data-revision-url="{{ route('studio.revision') }}">
<a href="#main" class="btn btn-primary fixed -top-20 left-4 z-50 focus:top-4">Skip to content</a>
<div class="drawer lg:drawer-open">
    <input id="workspace-drawer" type="checkbox" class="drawer-toggle" aria-label="Toggle navigation">
    <div class="drawer-content min-w-0">
        <header class="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 sm:px-8">
            <div class="flex min-w-0 items-center gap-3"><label for="workspace-drawer" class="btn btn-square btn-ghost btn-sm lg:hidden" aria-label="Open navigation">☰</label><span class="text-sm text-base-content/50">Workspace</span><span class="text-base-content/25">/</span><span class="truncate text-sm font-medium">@yield('title', 'Overview')</span></div>
            <div class="flex items-center gap-3"><span class="hidden text-xs text-base-content/50 sm:block">Internal email tools</span><button type="button" class="btn btn-ghost btn-square btn-sm" data-theme-toggle aria-label="Switch workspace appearance" title="Switch workspace appearance">◐</button><span class="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-semibold text-primary" aria-hidden="true">M</span></div>
        </header>
        <main id="main" class="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-8">
            @if ($errors->any())<div role="alert" class="alert alert-error"><div><p class="font-semibold">Check the highlighted fields</p><ul class="list-inside list-disc text-sm">@foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div></div>@endif
            @yield('content')
        </main>
    </div>
    <aside class="drawer-side z-30">
        <label for="workspace-drawer" aria-label="Close navigation" class="drawer-overlay"></label>
        <div class="flex min-h-full w-60 flex-col border-r border-base-300 bg-base-100">
            <a href="{{ route('studio.home') }}" class="flex h-16 items-center gap-3 border-b border-base-300 px-6"><span class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content font-bold">m</span><span class="font-semibold tracking-tight">modular<span class="block text-[10px] font-normal uppercase tracking-[.18em] text-base-content/50">Email workspace</span></span></a>
            <div class="px-4 pt-6"><a href="{{ route('workflow.create', ['theme' => $theme]) }}" class="btn btn-primary btn-sm w-full">+ New email</a></div>
            <nav class="flex-1 p-3" aria-label="Main navigation"><ul class="menu w-full gap-1">
                <li class="menu-title mt-3 text-[10px] uppercase tracking-widest">Workspace</li>
                <li><a href="{{ route('studio.home') }}" @if($library === 'overview') class="menu-active" aria-current="page" @endif>Overview</a></li>
                <li><a href="{{ route('studio.library', ['library' => 'drafts']) }}" @if($library === 'drafts') class="menu-active" aria-current="page" @endif>Builds <span class="badge badge-ghost badge-sm ml-auto">{{ count($inventory['drafts']) }}</span></a></li>
                <li><a href="{{ route('workflow.create') }}" @if($library === 'workflow') class="menu-active" aria-current="page" @endif>Build brief</a></li>
                <li class="menu-title mt-5 text-[10px] uppercase tracking-widest">Design library</li>
                @foreach (['emails' => 'Emails', 'recipes' => 'Recipes', 'components' => 'Components', 'brands' => 'Brands'] as $destination => $label)
                    <li><a href="{{ route('studio.library', ['library' => $destination, 'theme' => $theme]) }}" @if($library === $destination) class="menu-active" aria-current="page" @endif>{{ $label }}<span class="ml-auto text-xs text-base-content/40">{{ count($inventory[$destination === 'brands' ? 'collections' : $destination]) }}</span></a></li>
                @endforeach
            </ul></nav>
            <div class="m-4 rounded-lg border border-base-300 p-3"><p class="flex items-center gap-2 text-xs font-medium"><span class="size-1.5 rounded-full bg-primary"></span>Local build workflow</p><p class="mt-2 text-xs leading-relaxed text-base-content/50">Brief → agent → review → export</p></div>
        </div>
    </aside>
</div>
<div id="workspace-status" class="toast toast-end z-50" role="status" aria-live="polite" hidden></div>
</body></html>

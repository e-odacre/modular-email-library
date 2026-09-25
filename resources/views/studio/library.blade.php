<section data-library class="space-y-5">
    <div class="flex flex-wrap items-end gap-3 rounded-xl border border-base-300 bg-base-100 p-4">
        <label class="min-w-48 flex-1 text-xs text-base-content/60">Search<input id="search" class="input input-sm mt-1.5 w-full text-base-content" type="search" placeholder="Name, description, or category"></label>
        <label class="text-xs text-base-content/60">Category<select id="category" class="select select-sm mt-1.5 block w-44 text-base-content"><option value="all">All categories</option>@foreach(collect($entries)->pluck('category')->unique() as $category)<option value="{{ $category }}">{{ ucwords(str_replace('-', ' ', $category)) }}</option>@endforeach</select></label>
        @if($library !== 'drafts')@include('studio.style')@endif
        <div class="join" aria-label="Library view"><button type="button" class="btn btn-sm join-item" data-library-view="grid" aria-pressed="true">Grid</button><button type="button" class="btn btn-sm join-item" data-library-view="list" aria-pressed="false">List</button></div>
    </div>
    <p id="result-count" class="text-xs text-base-content/50" role="status">{{ count($entries) }} designs</p>
    <div class="workspace-grid grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3" data-grid>
        @foreach($entries as $entry)
            @php
                $kind = ['emails' => 'email', 'recipes' => 'recipe', 'components' => 'component', 'drafts' => 'draft', 'brands' => 'collection'][$library];
                $selectedStyle = $kind === 'draft' ? ($entry['theme'] ?? 'minimal') : $theme;
                $href = $entry['href'] ?? route('studio.'.$kind, ['id' => $entry['id'], 'theme' => $selectedStyle]);
                $frame = $entry['frame'] ?? route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $selectedStyle]);
            @endphp
            <article class="card overflow-hidden border border-base-300 bg-base-100 hover:border-primary/40" data-entry data-category="{{ $entry['category'] }}" data-search="{{ mb_strtolower($entry['name'].' '.$entry['description'].' '.$entry['category']) }}">
                <a class="design-thumbnail" href="{{ $href }}" aria-label="Preview {{ $entry['name'] }}"><iframe data-src="{{ $frame }}" title="{{ $entry['name'] }} thumbnail" loading="lazy" tabindex="-1" aria-hidden="true" sandbox="allow-same-origin" scrolling="no"></iframe></a>
                <div class="card-body design-card-body gap-3 p-5"><div class="design-card-copy"><div class="mb-2 flex items-center justify-between gap-2"><span class="text-[10px] font-medium uppercase tracking-wider text-base-content/45">{{ $entry['category'] }}</span>@isset($entry['variants'])<span class="badge badge-ghost badge-xs">{{ count($entry['variants']) }} variants</span>@endisset @if($kind === 'draft')<span class="badge badge-outline badge-xs">{{ $entry['state'] === 'invalid' ? 'Needs attention' : 'Needs review' }}</span>@endif</div><h2 class="font-semibold"><a class="hover:text-primary" href="{{ $href }}">{{ ucfirst($entry['name']) }}</a></h2><p class="design-description mt-2 line-clamp-2 text-xs leading-relaxed text-base-content/55">{{ $entry['description'] }}</p></div><div class="design-actions card-actions mt-1"><a class="btn btn-sm btn-outline" href="{{ $href }}">{{ $kind === 'draft' ? 'Review build' : 'Preview' }}</a>@if($kind === 'recipe')<a class="btn btn-ghost btn-sm" href="{{ route('workflow.create', ['recipe' => $entry['id'], 'theme' => $theme]) }}">Use recipe →</a>@endif</div></div>
            </article>
        @endforeach
    </div>
    <div id="empty" class="rounded-xl border border-dashed border-base-300 bg-base-100 p-12 text-center" hidden><h2 class="font-semibold">{{ $library === 'drafts' && !count($entries) ? 'Your builds will appear here' : 'No matches found' }}</h2><p class="mt-2 text-sm text-base-content/50">{{ $library === 'drafts' && !count($entries) ? 'Prepare a brief, then let your local agent create the email.' : 'Try another search or clear your filters.' }}</p><button id="reset" class="btn btn-sm btn-outline mt-4">Clear filters</button>@if($library === 'drafts')<a class="btn btn-sm btn-primary mt-4" href="{{ route('workflow.create') }}">Prepare a brief</a>@endif</div>
    <div class="text-center"><button id="more" class="btn btn-outline btn-sm" hidden>Show more</button></div>
    <noscript><p>Open a design above to preview it. Enable JavaScript for search and thumbnails.</p></noscript>
</section>

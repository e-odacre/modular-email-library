@extends('studio.layout')
@section('title', $library === 'overview' ? 'Email library' : ucfirst($library))
@section('content')
<section class="intro"><div><h1>{{ $library === 'overview' ? 'Email library' : ucfirst($library) }}</h1></div></section>
@if ($library === 'overview')
    <section class="path-grid" aria-label="Libraries">
        @foreach (['emails', 'components', 'recipes'] as $destination)
            <a class="path-card" href="{{ route('studio.library', ['library' => $destination, 'theme' => $theme]) }}"><h2>{{ ucfirst($destination) }}</h2><p>{{ count($inventory[$destination]) }} designs</p></a>
        @endforeach
    </section>
@endif
@if (in_array($library, ['overview', 'brands']))
    @foreach ($inventory['collections'] as $collection)
        <a class="collection-card" href="{{ route('studio.collection', $collection['id']) }}"><div><h2>{{ $collection['name'] }}</h2><p>{{ $collection['blocks'] }} blocks · {{ $collection['emails'] }} emails · Draft collection</p></div><span class="button">Open collection</span></a>
    @endforeach
@else
    <section class="library" data-library>
        <div class="toolbar"><div class="filters">
            <label>Search {{ $library }}<input id="search" type="search" placeholder="Search by name or description"></label>
            <label>Category<select id="category"><option value="all">All categories</option>
                @foreach (collect($entries)->pluck('category')->unique() as $category)
                    <option value="{{ $category }}">{{ ucwords(str_replace('-', ' ', $category)) }}</option>
                @endforeach
            </select></label>
            @include('studio.style')
        </div></div>
        <p id="result-count" class="result-count" role="status">{{ count($entries) }} designs</p>
        <div class="grid">
            @foreach ($entries as $entry)
                @php($kind = ['emails' => 'email', 'recipes' => 'recipe', 'components' => 'component'][$library])
                <article class="card" data-entry data-category="{{ $entry['category'] }}" data-search="{{ strtolower($entry['name'].' '.$entry['description'].' '.$entry['category']) }}">
                    <a class="thumbnail" href="{{ route('studio.'.$kind, ['id' => $entry['id'], 'theme' => $theme]) }}" aria-label="Preview {{ $entry['name'] }}">
                        <iframe data-src="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme]) }}" title="{{ $entry['name'] }} thumbnail" loading="lazy" tabindex="-1" aria-hidden="true" sandbox="allow-same-origin" scrolling="no"></iframe>
                    </a>
                    <div class="card-meta"><span>{{ $entry['category'] }}</span>@isset($entry['variants'])<span>{{ count($entry['variants']) }} variants</span>@endisset</div>
                    <h2><a href="{{ route('studio.'.$kind, ['id' => $entry['id'], 'theme' => $theme]) }}">{{ ucfirst($entry['name']) }}</a></h2><p>{{ $entry['description'] }}</p>
                </article>
            @endforeach
        </div>
        <div id="empty" class="empty-state" hidden><h2>No matches found</h2><button id="reset" class="button">Clear filters</button></div>
        <button id="more" class="more" hidden>Show more</button>
        <noscript><p>Open a design above to preview it. Enable JavaScript for search and thumbnails.</p></noscript>
    </section>
@endif
@endsection

@extends('studio.layout')
@section('title', ucfirst($entry['name']))
@section('content')
<a class="back-link" href="{{ route('studio.library', ['library' => $library, 'theme' => $theme]) }}">← {{ ucfirst($library) }}</a>
<section class="intro"><div><h1>{{ ucfirst($entry['name']) }}</h1><p>{{ $entry['description'] }}</p></div></section>
<section data-preview>
    <div class="toolbar">
        <div class="tabs" aria-label="Preview width"><button data-width="600" aria-pressed="true">Desktop · 600</button><button data-width="375" aria-pressed="false">Phone · 375</button></div>
        <div class="filters">@include('studio.style')</div>
    </div>
    @if ($kind !== 'component')
        <div class="export-actions">
            <a class="button" href="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme]) }}" target="_blank" rel="noopener">Open HTML</a>
            <a class="button" href="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme, 'download' => 1]) }}">Download HTML</a>
            <span>{{ number_format($result['bytes'] / 1024, 1) }} KB · {{ $result['brand'] }} preview</span>
        </div>
    @endif
    @if ($result['diagnostics']['errors'] || $result['diagnostics']['warnings'])
        <details class="notes" @if ($result['diagnostics']['errors']) open @endif><summary>Preview diagnostics</summary><ul>
            @foreach (array_merge($result['diagnostics']['errors'], $result['diagnostics']['warnings']) as $message)<li>{{ $message }}</li>@endforeach
        </ul></details>
    @endif
    @if ($kind === 'component')
        @foreach ($entry['variants'] as $variant => $definition)
            <article class="variant"><h2>{{ ucwords(str_replace('-', ' ', $variant)) }}</h2><p>{{ $definition['description'] ?? '' }}</p>
                <a class="button" href="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme, 'variant' => $variant]) }}" target="_blank" rel="noopener">Open variant HTML</a>
                <div class="preview-stage"><iframe class="email-preview" src="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme, 'variant' => $variant]) }}" title="{{ $entry['name'] }} / {{ $variant }}" sandbox="allow-same-origin" loading="lazy" width="600"></iframe></div>
            </article>
        @endforeach
        <details class="notes"><summary>Component fields and settings</summary><p>Component: <code>{{ $entry['id'] }}</code></p><p>Fields: {{ implode(', ', array_keys($entry['fields'])) }}</p><p>Settings: {{ implode(', ', array_keys($entry['settings'])) }}</p></details>
    @else
        <div class="preview-stage"><iframe class="email-preview" src="{{ route('studio.frame', ['kind' => $kind, 'id' => $entry['id'], 'theme' => $theme]) }}" title="{{ $entry['name'] }} preview" sandbox="allow-same-origin" width="600"></iframe></div>
    @endif
</section>
@endsection

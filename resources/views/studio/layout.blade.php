<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Email library') / Modular</title>
    @foreach (['gallery.css', 'studio.css', 'workspace.css'] as $asset)
        <link rel="stylesheet" href="{{ route('studio.asset', $asset) }}">
    @endforeach
</head>
<body data-revision-url="{{ route('studio.revision') }}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="masthead">
    <a class="wordmark" href="{{ route('studio.home', ['theme' => $theme]) }}">modular<span> / EMAIL LIBRARY</span></a>
    <nav aria-label="Main navigation">
        @foreach (['emails', 'components', 'recipes', 'brands'] as $destination)
            <a href="{{ route('studio.library', ['library' => $destination, 'theme' => $theme]) }}" @if ($library === $destination) aria-current="page" @endif>{{ ucfirst($destination) }}</a>
        @endforeach
    </nav>
</header>
<main id="main">@yield('content')</main>
<script src="{{ route('studio.asset', 'studio.js') }}" defer></script>
<script src="{{ route('studio.asset', 'workspace.js') }}" defer></script>
</body>
</html>

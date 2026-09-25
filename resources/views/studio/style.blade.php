<label>Style
    <select id="style">
        @foreach ($inventory['themes'] as $option)
            <option value="{{ $option }}" @selected($theme === $option)>{{ ucwords(str_replace('-', ' ', $option)) }}</option>
        @endforeach
    </select>
</label>

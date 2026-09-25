<label class="flex items-center gap-2 text-xs text-base-content/60">Email style
<select id="style" class="select select-sm w-40 text-base-content">
@foreach ($inventory['themes'] as $option)<option value="{{ $option }}" @selected($theme === $option)>{{ ucwords(str_replace('-', ' ', $option)) }}</option>@endforeach
</select></label>

<?php

namespace App\Services;

class EmailBuildPrompt
{
    public function generate(array $brief): string
    {
        $context = json_encode($brief, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $target = 'email-engine/drafts/'.$brief['slug'].'.json';

        return <<<PROMPT
        Build one email in this modular-email-library repository from the brief below.

        Read AGENTS.md, email-engine/CLAUDE.md, email-engine/docs/architecture.md,
        email-engine/docs/recipes-guide.md, and email-engine/scripts/lib/drafts.js first.
        Use the existing Node/MJML renderer and registered components. Do not change the application UI.

        Brief:
        ```json
        {$context}
        ```

        Output: {$target}
        Do not overwrite an existing file at that path; ask for a different slug if it exists.
        Create a JSON object with title, description, brand, theme, and either:
        - recipe (the selected recipe ID) plus data (complete content matching its schema), or
        - nodes (an ordered array of existing component/data/variant/settings nodes).
        Read email-engine/recipes/{$brief['recipe']}.js for the selected starting point and its previewData contract.
        The brand must be exactly "{$brief['brand']}" and the theme "{$brief['theme']}".

        For a brand collection, read its README.md, RESEARCH.md, catalog.js and tokens.draft.json
        under email-engine/brands/{$brief['brand']}/. Use only that brand's content, assets and tokens.
        For the placeholder brand, use email-engine/tokens/placeholder.json and clearly label example copy.
        Use only supported facts from the brief and brand research. Do not invent claims, testimonials,
        brand values or image URLs. If required information is absent, ask rather than silently fill it.
        Keep unresolved brand values marked. Do not promote draft tokens to production.

        Include a complete email frame, preheader, subscription controls and organization address.
        Preserve Klaviyo tags verbatim; Nunjucks delimiters are [[ ]] and [% %].
        Do not put executable HTML or JavaScript in the JSON. Validate image alt text and links.

        Verify with:
        npm run email:check -- {$brief['slug']}
        npm run email:test

        Report the exact output path, checks, remaining warnings, and any missing information.
        The app discovers the JSON in Builds automatically; open it to review desktop/mobile previews
        and export HTML. Passing compilation is not inbox approval. Do not send, commit, push or deploy.
        PROMPT;
    }
}

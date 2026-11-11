# Codester media assets checklist

Prepare these before uploading to Codester:

| Asset | Size | Status |
|---|---|---|
| Preview image | 800×400 (or 1600×800) | Starters in `public/codester/` |
| Icon | 200×200 | `public/codester/icon-200x200.png` |
| Screenshots zip | 3–9 JPG/PNG | Cropped UI only — capture from live demo |

## Recommended screenshots

1. Landing hero
2. Dashboard home
3. Generator workspace (e.g. AI Writer)
4. History page
5. Settings / plans
6. Admin panel (optional)

Tips from Codester: no messy desktop chrome, use clean demo data, English UI.

Generated starters (run `npm run assets:codester`):

- `public/codester/preview-800x400.png`
- `public/codester/preview-1600x800.png`
- `public/codester/icon-200x200.png`

Hero art: `public/images/ai-forge-banner.png`

After capture, put UI screenshots in `public/screenshots/`, then zip them
separately for the Codester “screenshot image set” field. Prefer real product
screenshots over the generated preview for the listing gallery.

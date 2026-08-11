# Remove i18n Logic from MaplatCore (Stateless Core)

## Why
- **Stateless Core**: Localization (i18n) state (e.g., "current language is Japanese") belongs to the UI layer, not the Core logic.
- **Flexibility**: `MaplatCore` should pass raw data (potentially containing multiple language strings) to the UI. The UI decides how to render it based on the user's preference.
- **Bundle Size**: Removing `i18next` and related internal logic reduces bundle size and complexity.

## Proposed Changes

### 1. Remove Dependencies & Internal Locales
- Uninstall `i18next`, `i18next-xhr-backend`, and `i18next-browser-languagedetector`.
- Remove `src/freeze_locales.ts`.

### 2. Remove Language State from MaplatApp
- Remove `lang` property from `MaplatApp`.
- Remove `i18nLoader` and `handleI18n`.
- Remove `browserLanguage` detection logic.
- Update `MaplatApp` constructor to NOT accept `lang` or `translateUI` options.

### 3. Update Data Handling (Multilingual Support)
- **Concept**: Core treats string-like metadata (e.g., `title`, `label`, `attr`) as "Opaque Data" or "Multilingual Objects". It does not try to resolve them to a specific string.
- **Type Definitions**:
    - Update `HistMap`, `NowMap`, and POI interfaces.
    - Change type of `title`, `label`, `description`, etc. from `string` to `string | Record<string, string>`.
    - Example:
      ```typescript
      // Before
      title: string;

      // After
      title: string | { [lang: string]: string };
      ```
- **Source Factory**:
    - In `src/source_ex.ts`, `baseDict` already uses objects for titles. Ensure `mapSourceFactory` passes these objects through without modification.
    - Remove usages of `translator` (e.g. `options.translator(options.url)`). If dynamic URL translation is needed, it should be handled by the caller before passing options, or via a new mechanism if absolutely necessary (but likely not needed for core logic).

### 4. Code Refactoring details
- **`src/index.ts`**:
    - Remove `i18n` imports.
    - Remove `translator` / `t` function injection.
    - Remove logic that waits for i18n loading.
- **`src/source/mixin.ts` / `histmap.ts`**:
    - Update TypeScript interfaces to allow object types for metadata fields.
- **`src/functions.ts`**:
    - Remove `data-i18n` attribute replacement in `createElement` if it relies on internal translation (or keep it if it's just a marker for consuming app, but likely remove if it implies Core doing translation).

## Migration Guide for Consumers
- **MaplatUI / Custom Apps**:
    - The `MaplatApp` instance will now expose POI and Map metadata as raw objects (e.g. `{ ja: "...", en: "..." }`) instead of a single string.
    - Consumers must implement their own logic to select the correct language string from these objects before rendering.
    - **Initialization**: No need to pass `lang` or `translator` to `MaplatApp`.

## Verification
- **Build**: Ensure types are correctly updated and build passes.
- **Smoke Test**: Verify that calling `map.getMapMeta()` returns the structured object for `title`/`label` instead of a string.

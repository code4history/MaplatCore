# Reading a IIIF manifest

[日本語](iiif-manifest.ja.md)

This page describes how the functions in `src/iiif/manifest.ts` (`listIiifCanvases`, `proposeIiifBindings`, `resolveIiifMetadata`, `compareIiifCopy`, `iiifRightsToLicense`, `IIIF_BINDABLE_KEYS`) read a manifest. They are not part of the package's public API: they are not in the public entry points (`exports`) of `package.json`, and their compatibility is not guaranteed. They are internal functions used by authoring tools such as MaplatEditor.

## Listing canvases (`listIiifCanvases`)

`listIiifCanvases` lists the canvases of Presentation 2 and 3 manifests. The `id` and `@id` of an image service are read independently of the Presentation version. When the service is an array, entries that are not image services or have an empty ID are skipped, and the first readable image service is chosen. A service with a type (`type` / `@type`) counts as an image service only when the type is `ImageService1` to `ImageService3`. An untyped service, as traditionally used with Image API 2, is accepted only when its `@context` or `profile` contains a URI including `iiif.io/api/image/`, or a `level0` to `level2` profile. Untyped authentication services (containing `/api/auth/`) and annex services (containing `annex/services`) are never chosen as the image, even when they come before the image service. Services with neither a type nor an Image API mark are not chosen either.

A canvas's `width` and `height` are the size of the drawing area. They are not necessarily the pixel size of the delivered image, so a caller that checks the image size uses the image service's `info.json`. This module itself does not make any network request.

## Default bindings (`proposeIiifBindings`)

`proposeIiifBindings` uses the manifest's `label` for the title. If it cannot be read, the title binding is omitted instead of falling back to the canvas label (such as `page 1`). An empty language array is not copied as a value, and a language value made only of whitespace is not taken as a reason to create a default binding.

## Reading values (`resolveIiifMetadata`)

A IIIF value (`label`, `summary` / `description`, `requiredStatement` / `attribution`, the `label` and `value` of a metadata entry, and so on) is read from a string, a Presentation 2 language-tagged value (`{"@value", "@language"}`) or an array of them, or a Presentation 3 language map.

When a value contains arrays inside arrays, they are flattened and the values inside are read. For example, a metadata value `["Creator", ["Author name"]]` is read as the two values `Creator` and `Author name`. Several values are joined with ` / ` for keys stored as text, such as the title, and with `<br>` for keys stored as HTML and for metadata values. Following nested arrays has a depth limit (32 levels), and it also stops on a value that contains itself (a cycle).

In the metadata table (`copiedMetadata`), entries whose value is empty (`{"en": []}`, an empty string, whitespace only, an empty array, nested arrays that are empty all the way down, an entry with no value, and so on) are dropped without a warning, because an empty entry has nothing worth copying. Entries with content in a shape that cannot be read (a number, a cyclic value, nesting deeper than the limit, and so on) are dropped with the warning `Manifest の metadata の値の形が読めません` (the shape of the metadata value cannot be read; "canvas の …" for canvas entries). If at least one value can be read, however, only the unreadable parts are dropped, without a warning, and the entry is kept.

Bound keys such as the title are checked separately from the metadata table. When the value is missing (including an empty string), the warning is `鍵 <key> の IIIF の値がありません` (there is no IIIF value); when a value is present but cannot be read, such as an empty language map, the warning is `鍵 <key> の IIIF の値の形が読めません` (the shape of the IIIF value cannot be read). In both cases the key is left unresolved (`unresolved`). A license (`rights` / `license`) is read only from a URI string, and its warnings say `ライセンスの値` (license value) instead of `IIIF の値`.

## Comparing with copied values (`compareIiifCopy`)

`compareIiifCopy(current, copiedValues, fresh, lang)` returns one row (`{ key, lang, humanEdited, iiifChanged }`) per key and language. Whether a person edited the value (`humanEdited`) is decided by comparing the map's current value with the value at the last copy (`copiedValues`); whether the IIIF side changed (`iiifChanged`) is decided by comparing the value at the last copy with the re-fetched value (`fresh`). The current IIIF value is never compared directly with the map's current value. When the map's current value is a string, it is compared as the value for the language `lang`.

When the re-fetched values (`fresh`) are given, keys and languages that are not in the last copy also get rows: a key bound after the last copy, a key the manifest had no value for at the last copy, and a language that appears in the re-fetched value. These rows count as changed on the IIIF side (`iiifChanged: true`). Because there is no value from the last copy, `humanEdited` is true when the map currently has a value for that language.

Rows are ordered key by key in the order of `copiedValues`: the languages from the last copy, then the languages added for that key. Keys that are not in `copiedValues` follow at the end, in the order of the re-fetched values. Without `fresh` (`undefined`), only the keys and languages in `copiedValues` are returned, with `iiifChanged` set to `undefined`.

## Out of scope

Only a single-image body in the first image annotation is handled. Compositing several images, Choice, and loading an external AnnotationPage are not supported. Even when several services are listed, this is not an API that automatically retries another candidate when a request fails.

See also: [service in Presentation 3](https://iiif.io/api/presentation/3.0/#service), [image service in the IIIF Cookbook](https://iiif.io/api/cookbook/recipe/0005-image-service/).

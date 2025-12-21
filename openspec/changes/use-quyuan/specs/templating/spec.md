# Spec Delta: Templating Capability

## MODIFIED Requirements

### Requirement: Quyuan Integration
The system MUST use Quyuan for all template rendering operations.


#### Scenario: Icon Generation
- **GIVEN** a POI with an ancestor hierarchy (Cluster, Layer, Source)
- **WHEN** `createIconSet` is called
- **THEN** it MUST traverse the hierarchy to find `iconTemplate`.
- **AND** it MUST use **Quyuan** to render the icon object (JSON) from the template.
- **AND** it MUST NOT use `lodash.template`.

#### Scenario: HTML Generation
- **GIVEN** a POI with an ancestor hierarchy
- **WHEN** `createHtmlFromTemplate` is called
- **THEN** it MUST traverse the hierarchy to find `poiTemplate`.
- **AND** it MUST use **Quyuan** to render the HTML string.
- **AND** it MUST NOT use `lodash.template`.

#### Scenario: Chuci Independence
- **GIVEN** MaplatCore usage
- **THEN** it SHOULD NOT require `Chuci` functionality (Slider elements) to be active/initialized for standard marker rendering, identifying `Quyuan` usage is purely for templating.

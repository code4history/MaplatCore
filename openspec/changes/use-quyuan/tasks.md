# Tasks

- [ ] Dependency Updates <!-- id: 1 -->
    - [ ] `npm uninstall lodash.template` <!-- id: 2 -->
    - [ ] `npm install @c4h/quyuan` <!-- id: 3 -->
- [ ] Code Migration <!-- id: 4 -->
    - [ ] Update `src/template_works.ts` <!-- id: 5 -->
        - [ ] Import `Quyuan`. <!-- id: 6 -->
        - [ ] Refactor `createIconSet` to use Quyuan. <!-- id: 7 -->
        - [ ] Refactor `createHtmlFromTemplate` to use Quyuan. <!-- id: 8 -->
- [ ] Verification <!-- id: 9 -->
    - [ ] Update `spec/template.spec.ts` (if assertions need adjustment). <!-- id: 10 -->
    - [ ] Run `npm run test` <!-- id: 11 -->
    - [ ] Manual verification of Marker/Popup rendering. <!-- id: 12 -->

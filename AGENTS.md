# AGENTS.md

This package owns browser rendering only. Scene snapshots have no dependency on Cortico, simulation state, scoring, persistence or networking. Flower stages, daylight and flight flags are supplied by the caller.

Run `npm run build`, `npm run typecheck` and `npm test` before committing. Test the packed ESM exports in an independent consumer before publishing. Keep the README aligned with `src/index.ts` and `src/types.ts`.

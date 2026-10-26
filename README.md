<!-- Owner: src/index.ts, src/types.ts -->
# terrarium-renderer

Canvas land and water ecosystem scenes, distinct plants and fruit, ground decorations, litter, decomposers, ten pot finishes, movement animation, plant tooltips and nest inspection. This package has no runtime dependencies and does not simulate, save, score or upload ecosystems.

```js
import { createScene } from 'terrarium-renderer';
const renderer = createScene(canvas, 'en');
renderer.setState(snapshot);
// When the view is removed:
renderer.dispose();
```

Use an 800×500 canvas and scale its CSS width to fit the container. `createScene` includes a clickable 4×4 nest viewer; `createLandRenderer` draws without the viewer. `createWaterScene` draws fish and aquatic plants. Creating interactive viewers requires a browser document; importing the package does not access the DOM.

`LandScene` and `WaterScene` describe display snapshots. Supply `gridSize` (default 5), facility positions and enabled states. Nest snapshots supply `foodCapacity` for the storage label. Land plants supply their computed `flower` stage and optional `seedHead` flag. Sunflower and mint use separate stems, leaves and flowers; ladybugs have spotted red wing cases, and aphids and ladybugs are drawn on their current host plant; soil supplies computed `daylight`, and bugs supply `flying`. Optional plant `health` and land `leafDamage` drive foliage color, brown patches, wilting, transparent bite holes and edge notches. Missing condition fields retain healthy foliage with no inferred damage. The caller records feeding and regrowth; rendering never changes state. The caller owns these rules. Snapshots are never mutated. `setState(snapshot, recordedAtMs)` on the interactive land scene uses recorded time for nest hatching labels. Replay timing and page controls belong to the caller.

Run `npm run build`, `npm run typecheck` and `npm test` before publishing. Build output contains native ESM and TypeScript declarations.

`Nest.size` optionally expands the interior grid from 4×4 to 8×8; omitted values render 4×4. Extra `Nest.entrances` are surface coordinates opening the same colony. Large interiors scroll horizontally on narrow displays. Occupancy, expansion and filled-soil rules belong to the caller.

Water plants may supply a computed `flower` (`bud` or `bloom`); the renderer does not infer flowering from stage or age. Waterlilies have floating pads, hornwort has whorled foliage, and duckweed has paired fronds and hanging roots. Neon tetras have blue/red stripes; corydoras have spotted bodies and barbels. `compost_bin` renders a wooden land bin. These species add no simulation or runtime dependencies.

Daisies and lavender use caller-supplied flower stages and foliage health; bees and butterflies have distinct silhouettes. Optional water `eggs` carry coordinates, species, health and incubation hours, drawn as translucent eggs with growing embryos. Fish with `juvenile: true` use a smaller silhouette. The caller computes pollination, incubation and age; omitted fields preserve existing snapshots.

`LandScene.economy.pots` accepts plot coordinates and a pot `kind`: `clay`, `porcelain`, `spring`, `slow`, `still`, `reservoir`, `drainage`, `shade`, `sun`, or `healing`. The renderer draws silhouettes and motifs without applying effects.

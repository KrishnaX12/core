import { expect, test } from "bun:test"
import { createPasteFixture } from "tests/fixtures/create-plated-hole-paste-fixture"
import "tests/fixtures/extend-expect-circuit-snapshot"

test("mask-covered circle, pill and oval holes emit no paste on either side", () => {
  const circuit = createPasteFixture()
  const circuitJson = circuit.getCircuitJson()
  const holes = circuitJson.filter(
    (element) => element.type === "pcb_plated_hole",
  )
  const paste = circuitJson.filter(
    (element) => element.type === "pcb_solder_paste",
  )
  expect(circuit).toMatchPcbSnapshot(import.meta.path, {
    showSolderPaste: true,
  })
  expect(holes).toHaveLength(6)
  for (const hole of holes) {
    const apertures = paste.filter(
      (aperture) => aperture.x === hole.x && aperture.y === hole.y,
    )
    expect(apertures.map((aperture) => aperture.layer).sort()).toEqual(
      hole.is_covered_with_solder_mask ? [] : ["bottom", "top"],
    )
  }
})

import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getNfcCoveredHolePasteRepro } from "tests/fixtures/get-nfc-covered-hole-paste-repro"
import "tests/fixtures/extend-expect-circuit-snapshot"

test("published NFC antenna terminal receives paste despite solder mask coverage", () => {
  const { antennaHole, renderedHoles, generatedPaste, circuitJson } =
    getNfcCoveredHolePasteRepro()
  expect(antennaHole.is_covered_with_solder_mask).toBe(true)
  expect(renderedHoles).toHaveLength(1)
  expect(renderedHoles[0].is_covered_with_solder_mask).toBe(true)
  expect(renderedHoles[0].x).toBeCloseTo(antennaHole.x, 9)
  expect(renderedHoles[0].y).toBeCloseTo(antennaHole.y, 9)
  expect(generatedPaste.map((paste) => paste.layer).sort()).toEqual([
    "bottom",
    "top",
  ])
  for (const paste of generatedPaste) {
    expect(paste.x).toBeCloseTo(antennaHole.x, 9)
    expect(paste.y).toBeCloseTo(antennaHole.y, 9)
  }
  expect(circuitJson).toMatchPcbSnapshot(import.meta.path, {
    showSolderPaste: true,
    layer: "bottom",
    height: 1600,
  })
  const closeup: AnyCircuitElement[] = [
    {
      type: "pcb_board",
      pcb_board_id: "terminal_paste_view",
      center: { x: antennaHole.x, y: antennaHole.y + 0.3 },
      width: 5,
      height: 2,
      thickness: 1.6,
      num_layers: 2,
      material: "fr4",
    },
    ...generatedPaste,
  ]
  closeup.push({
    type: "pcb_note_text",
    pcb_note_text_id: "terminal_paste_caption",
    text: `Masked L1 terminal: ${generatedPaste.length} paste apertures (both sides)`,
    anchor_position: { x: antennaHole.x, y: antennaHole.y + 0.8 },
    anchor_alignment: "center",
    font: "tscircuit2024",
    font_size: 0.1,
    layer: "bottom",
  })
  expect(closeup).toMatchPcbSnapshot(
    import.meta.path.replace(".test.tsx", "-terminal.test.tsx"),
    {
      showSolderPaste: true,
      showPcbNotes: true,
      layer: "bottom",
      viewport: {
        minX: antennaHole.x - 2.5,
        maxX: antennaHole.x + 2.5,
        minY: antennaHole.y - 0.7,
        maxY: antennaHole.y + 1.3,
      },
    },
  )
})

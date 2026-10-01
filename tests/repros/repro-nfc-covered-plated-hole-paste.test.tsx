import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getNfcCoveredHolePasteRepro } from "tests/fixtures/get-nfc-covered-hole-paste-repro"
import "tests/fixtures/extend-expect-circuit-snapshot"

test("published NFC antenna terminal emits no paste when covered with solder mask", () => {
  const { antennaHole, renderedHoles, generatedPaste } =
    getNfcCoveredHolePasteRepro()
  expect(antennaHole.is_covered_with_solder_mask).toBe(true)
  expect(renderedHoles).toHaveLength(1)
  expect(renderedHoles[0].is_covered_with_solder_mask).toBe(true)
  expect(renderedHoles[0].x).toBeCloseTo(antennaHole.x, 9)
  expect(renderedHoles[0].y).toBeCloseTo(antennaHole.y, 9)
  expect(generatedPaste.map((paste) => paste.layer).sort()).toEqual([])
  for (const paste of generatedPaste) {
    expect(paste.x).toBeCloseTo(antennaHole.x, 9)
    expect(paste.y).toBeCloseTo(antennaHole.y, 9)
  }
  // Display only generated paste so copper cannot obscure the regression.
  const closeup: AnyCircuitElement[] = [...generatedPaste]
  const captions = [
    { text: "COVERED NFC ANTENNA HOLE", y: 1.05, size: 0.2 },
    { text: "Solder paste layer - bottom", y: 0.7, size: 0.16 },
    {
      text: generatedPaste.length
        ? "BUG: paste on a masked hole"
        : "FIXED: no paste on a masked hole",
      y: -0.7,
      size: 0.18,
    },
    {
      text: `${generatedPaste.length} paste apertures total (top + bottom)`,
      y: -1.05,
      size: 0.16,
    },
  ]
  if (generatedPaste.length === 0) {
    captions.push({ text: "NO PASTE", y: 0, size: 0.23 })
  }
  for (const [index, caption] of captions.entries()) {
    closeup.push({
      type: "pcb_note_text",
      pcb_note_text_id: `terminal_paste_caption_${index}`,
      text: caption.text,
      anchor_position: { x: antennaHole.x, y: antennaHole.y + caption.y },
      anchor_alignment: "center",
      font: "tscircuit2024",
      font_size: caption.size,
      layer: "bottom",
    })
  }
  expect(closeup).toMatchPcbSnapshot(
    import.meta.path.replace(".test.tsx", "-terminal.test.tsx"),
    {
      showSolderPaste: true,
      showPcbNotes: true,
      layer: "bottom",
      viewport: {
        minX: antennaHole.x - 2,
        maxX: antennaHole.x + 2,
        minY: antennaHole.y - 1.5,
        maxY: antennaHole.y + 1.5,
      },
    },
  )
})

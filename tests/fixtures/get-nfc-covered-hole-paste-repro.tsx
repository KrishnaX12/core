import { RootCircuit } from "lib/RootCircuit"
import "lib/register-catalogue"
import type { AnyCircuitElement, PcbPlatedHole } from "circuit-json"
import publishedCircuitJson from "tests/repros/assets/tensa-zangetsu-nfc-covered-hole.circuit.json"

/**
 * Published krishnax12/tensa-zangetsu-keychain-nfc v0.0.5, release
 * 82a93e6b-9b93-43fd-8e02-f8449b6784b8. Preserve the published board and
 * routing as context; freshly render its tented antenna terminal to exercise
 * core's paste generation independently of the board's local dependency patch.
 * Coordinates are board-world mm: +X right, +Y top; positions include translation.
 */
export const getNfcCoveredHolePasteRepro = () => {
  const circuitJson = structuredClone(
    publishedCircuitJson,
  ) as AnyCircuitElement[]
  const antennaHole = circuitJson.find(
    (element): element is PcbPlatedHole =>
      element.type === "pcb_plated_hole" &&
      element.is_covered_with_solder_mask === true,
  )
  if (!antennaHole || antennaHole.shape !== "circle")
    throw new Error("Missing published circular antenna terminal")
  const circuit = new RootCircuit()
  circuit.add(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="L1_TERMINAL"
        pcbX={antennaHole.x}
        pcbY={antennaHole.y}
        allowOffBoard
        footprint={
          <footprint>
            <platedhole
              shape="circle"
              holeDiameter={antennaHole.hole_diameter}
              outerDiameter={antennaHole.outer_diameter}
              coveredWithSolderMask={antennaHole.is_covered_with_solder_mask}
              portHints={antennaHole.port_hints}
            />
          </footprint>
        }
      />
    </board>,
  )
  circuit.render()
  const renderedCircuitJson = circuit.getCircuitJson()
  const generatedPaste = renderedCircuitJson.filter(
    (element) => element.type === "pcb_solder_paste",
  )
  const renderedHoles = renderedCircuitJson.filter(
    (element) => element.type === "pcb_plated_hole",
  )
  return {
    antennaHole,
    renderedHoles,
    generatedPaste,
    circuitJson: [...circuitJson, ...generatedPaste],
  }
}

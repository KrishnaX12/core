import { test, expect } from "bun:test"
import { Circuit } from "@tscircuit/core"

test("sot23_5 footprint should have a 3D model", async () => {
  const circuit = new Circuit()
  
  circuit.add(
    <board width="10mm" height="10mm">
      <chip name="U1" footprint="sot23_5" />
    </board>
  )

  const circuitJson = await circuit.getCircuitJson()
  
  // Check if the 3D CAD component was generated for sot23_5
  const cadComponents = circuitJson.filter((c) => c.type === "cad_component")
  expect(cadComponents.length).toBeGreaterThan(0, "BUG: Missing cad_component for sot23_5 footprint")
})

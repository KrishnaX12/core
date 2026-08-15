import { test, expect } from "bun:test"
import { getTestFixture } from "../fixtures/get-test-fixture"

test("sot23_5 footprint should have a 3D model", async () => {
  const { circuit } = getTestFixture()
  
  circuit.add(
    <board width="10mm" height="10mm">
      <chip name="U1" footprint="sot23_5" />
    </board>
  )

  const circuitJson = await circuit.getCircuitJson()
  
  // Create a snapshot of the circuit JSON
  expect(circuitJson).toMatchSnapshot()
  
  // Explicitly check for the CAD component
  const cadComponents = circuitJson.filter((c) => c.type === "cad_component")
  expect(cadComponents.length).toBeGreaterThan(0, "BUG: Missing cad_component for sot23_5 footprint")
})

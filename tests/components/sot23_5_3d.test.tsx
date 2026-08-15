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
  const cadComponent = circuitJson.find((c) => c.type === "cad_component")

  // Snapshot only the cad_component — shows model_jscad is undefined (the bug!)
  // When fixed, model_jscad should contain the SOT-23-5 3D body geometry
  expect(cadComponent).toMatchSnapshot()
})

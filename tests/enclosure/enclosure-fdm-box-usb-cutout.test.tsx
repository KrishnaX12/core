import { expect, test } from "bun:test"
import { enclosure } from "lib"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("renders namespaced enclosure elements without throwing", async () => {
  const { circuit } = getTestFixture()

  circuit.add(
    <group>
      <board name="main-board" width="40mm" height="24mm" routingDisabled>
        <connector
          name="USB1"
          manufacturerPartNumber="USB_C_TEST"
          pcbX="0mm"
          pcbY="11mm"
          allowOffBoard
          pinLabels={{ pin1: ["VBUS"], pin2: ["GND"] }}
          footprint={
            <footprint insertionDirection="from_front">
              <smtpad
                portHints={["pin1"]}
                pcbX="-1.5mm"
                pcbY="0mm"
                width="1mm"
                height="4mm"
                shape="rect"
              />
              <smtpad
                portHints={["pin2"]}
                pcbX="1.5mm"
                pcbY="0mm"
                width="1mm"
                height="4mm"
                shape="rect"
              />
            </footprint>
          }
          cadModel={{
            objUrl:
              "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.obj?uuid=617b05f9bba7410b96c001093d8189e4",
            pcbRotationOffset: 0,
            modelOriginPosition: {
              x: 0,
              y: -2.7500289000000517,
              z: 0.000010999999999872223,
            },
          }}
        >
          <enclosure.cutoutaperture
            shape="pill"
            width="9mm"
            height="3.6mm"
            margin="0.5mm"
          />
        </connector>
      </board>
      <enclosure.fdm.box boardRef=".main-board" />
    </group>,
  )

  await circuit.renderUntilSettled()

  await expect(circuit).toMatchSimple3dSnapshot(import.meta.path, {
    camPos: [30, 24, 50],
    poppygl: {
      lookAt: [0, 0, 3.5],
      backgroundColor: [1, 1, 1],
      grid: false,
    },
  })

  await expect(circuit).toMatchSimple3dSnapshot(import.meta.path, {
    snapshotSuffix: "top-down-orthographic",
    cameraPreset: "top_down_orthographic",
    poppygl: {
      backgroundColor: [1, 1, 1],
      grid: false,
    },
  })
})

import { RootCircuit } from "lib/RootCircuit"
import "lib/register-catalogue"
export const createPasteFixture = () => {
  const circuit = new RootCircuit()
  circuit.add(
    <board width={18} height={10} routingDisabled>
      {[false, true].map((coveredWithSolderMask, row) => (
        <group key={row} pcbY={row === 0 ? 2 : -2}>
          {(["circle", "pill", "oval"] as const).map((shape, column) => (
            <chip
              key={column}
              name={`U${row * 3 + column + 1}`}
              pcbX={column * 5 - 5}
              footprint={
                <footprint>
                  {shape === "circle" ? (
                    <platedhole
                      shape="circle"
                      holeDiameter={0.3}
                      outerDiameter={1.2}
                      coveredWithSolderMask={coveredWithSolderMask}
                    />
                  ) : (
                    <platedhole
                      shape={shape}
                      holeWidth={0.3}
                      holeHeight={0.6}
                      outerWidth={1.2}
                      outerHeight={1.8}
                      coveredWithSolderMask={coveredWithSolderMask}
                    />
                  )}
                </footprint>
              }
            />
          ))}
        </group>
      ))}
      <pcbnotetext text="Uncovered controls" pcbX={0} pcbY={4} />
      <pcbnotetext text="Mask-covered holes" pcbX={0} pcbY={-4} />
    </board>,
  )
  circuit.render()
  return circuit
}

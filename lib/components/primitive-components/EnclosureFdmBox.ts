import { enclosureFdmBoxProps } from "@tscircuit/props"
import { PrimitiveComponent } from "../base-components/PrimitiveComponent"

export class EnclosureFdmBox extends PrimitiveComponent<
  typeof enclosureFdmBoxProps
> {
  get config() {
    return {
      componentName: "EnclosureFdmBox",
      zodProps: enclosureFdmBoxProps,
    }
  }
}

import { enclosureCutoutApertureProps } from "@tscircuit/props"
import { PrimitiveComponent } from "../base-components/PrimitiveComponent"

/**
 * Metadata consumed by enclosure generators. The aperture itself does not emit
 * Circuit JSON; its nearest ancestor with a pcb_component determines where the
 * enclosure opening is placed.
 */
export class EnclosureCutoutAperture extends PrimitiveComponent<
  typeof enclosureCutoutApertureProps
> {
  get config() {
    return {
      componentName: "EnclosureCutoutAperture",
      zodProps: enclosureCutoutApertureProps,
    }
  }
}

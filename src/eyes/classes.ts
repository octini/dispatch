// F17 classes, intake, and no-scope (F17-VL-07) + vision-capable pins (F17-VL-03).
// Classes: screenshots, UI renders, design mocks, diagrams, charts,
// scanned/handwritten docs, image-bearing PDFs. donsetch OCR owns document
// TEXT (F10); the vision lane owns visual UNDERSTANDING. Intake: user-supplied
// files/URLs plus workspace files. NO web image search. No-scope, refused:
// image generation/editing, video, OCR-engine replacement. Pins: at least ONE
// of Dispatcher/Seeker vision-capable per preset (both preferred); per-SKU
// vision flags are UNVERIFIED BUILD-PIN FACTS via the F7 live picker.

export const VISION_CLASSES = [
  "screenshots",
  "ui-renders",
  "design-mocks",
  "diagrams",
  "charts",
  "scanned-docs",
  "image-pdfs",
] as const;

export type VisionClass = (typeof VISION_CLASSES)[number];

export const VISION_NO_SCOPE = [
  "image-generation",
  "image-editing",
  "video",
  "web-image-search",
  "ocr-engine-replacement",
] as const;

export type VisionNoScope = (typeof VISION_NO_SCOPE)[number];

/** donsetch owns document TEXT; the lane owns visual UNDERSTANDING — for an
 * image-bearing PDF both run, each on its side of the boundary. */
export function splitPdfWork(visionClass: VisionClass): { text: "donsetch"; visual: "vision-lane" } | null {
  if (visionClass !== "image-pdfs") return null;
  return { text: "donsetch", visual: "vision-lane" };
}

/** No-scope requests are refused. */
export function assertVisionScope(requested: string): void {
  if ((VISION_NO_SCOPE as readonly string[]).includes(requested)) {
    throw new Error(`vision lane no-scope refused: ${requested}`);
  }
}

/** Preset pin rule: neither-seat-capable refuses; per-SKU flags stay UNVERIFIED. */
export const PER_SKU_VISION_FLAGS = "UNVERIFIED (build-pin facts via the F7 live picker; none asserted here)" as const;

export function checkPresetPin(preset: { dispatcherCapable: boolean; seekerCapable: boolean }): void {
  if (!preset.dispatcherCapable && !preset.seekerCapable) {
    throw new Error("vision pin violation: preset with neither Dispatcher nor Seeker vision-capable refuses vision work");
  }
}

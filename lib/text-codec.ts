/** @format */

const textEncoder = new TextEncoder()

export function encodeText(value: string): Uint8Array {
  return textEncoder.encode(value)
}

export function createTextDecoder(): TextDecoder {
  return new TextDecoder()
}

export function decodeText(
  value: AllowSharedBufferSource,
  options?: TextDecodeOptions,
): string {
  return createTextDecoder().decode(value, options)
}

export function bitmask(bytes: number): number {
  if (bytes > 31) throw new Error(`bit mask too big for number type (size ${bytes}, max 31)`);
  return 0x7fffffff >> (31 - bytes);
}

export function repeatMask(mask: number, maskSize: number, bytes: number): number {
  mask &= bitmask(maskSize);
  let band = mask, written = 0;
  while (written < bytes) {
    const write = Math.min(maskSize, bytes - (written += maskSize));
    const bits = (mask & bitmask(write)) << written;
    band |= bits << written;
  }
  return band;
}

export function cycle(num: number, size: number, offset = 0): number {
  return offset + (num - offset + size) % size;
}

export function bitMaskShift(mask: number, shift: number, maskSize: number, size: number, offset?: number): number {
  const shiftMaskBy = cycle(shift, size, offset)
  const maskBand = repeatMask(mask, maskSize, size);
  const maskLower = maskBand >> shiftMaskBy;
  const maskHigher = maskBand << (31 - shiftMaskBy);
  return (maskLower | maskHigher) & bitmask(size);
}

export function numberFor(text: string, min = 0, max = 1): number {
  const num = bitsFor(text);
  const ratio = num / bitmask(31);
  return (max - min) * ratio + min;
}

export function bitsFor(text: string): number {
  const bits = 6, chars = 24, offset = 2;
  const nibbles = text.trim().toLowerCase().substr(0, chars).split("").map(it => it.charCodeAt(0) & bitmask(bits));
  let num = 0, shift = 0;
  for (const nibble of nibbles) {
    const mask = bitMaskShift(nibble, shift += bits - 1, bits, 31, offset);
    const mask2 = bitMaskShift(mask, shift - 11, bits, 31, -offset);
    num ^= mask ^ mask2;
  }
  return num;
}

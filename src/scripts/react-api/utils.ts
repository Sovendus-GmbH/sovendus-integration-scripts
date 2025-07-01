export function loggerError(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.error(`Sovendus App [${pageType}] - ${message}`, ...other);
}

export function loggerInfo(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.log(`Sovendus App [${pageType}] - ${message}`, ...other);
}

/**
 * A JavaScript implementation of the MD5 hash function.
 * Based on the work by Paul Johnston and others (public domain).
 * @param input String to hash
 * @returns MD5 hash of the input string
 */
export function md5(_input: string): string {
  const input = _input.trim();
  function RotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX: number, lY: number): number {
    const lX8: number = lX & 0x80000000;
    const lY8: number = lY & 0x80000000;
    const lX4: number = lX & 0x40000000;
    const lY4: number = lY & 0x40000000;
    const lResult: number = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x: number, y: number, z: number): number {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number): number {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number): number {
    return y ^ (x | ~z);
  }

  function FF(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(str: string): number[] {
    let lWordCount: number;
    const lMessageLength: number = str.length;
    const lNumberOfWords_temp1: number = lMessageLength + 8;
    const lNumberOfWords_temp2: number =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords: number = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray: number[] = new Array(lNumberOfWords - 1);
    let lBytePosition: number = 0;
    let lByteCount: number = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        (lWordArray[lWordCount] || 0) |
        (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] =
      (lWordArray[lWordCount] || 0) | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue: number): string {
    let WordToHexValue = "";
    let WordToHexValue_temp = "";
    let lByte: number;
    let lCount: number;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = `0${lByte.toString(16)}`;
      WordToHexValue += WordToHexValue_temp.substring(
        WordToHexValue_temp.length - 2,
        WordToHexValue_temp.length,
      );
    }
    return WordToHexValue;
  }

  // Convert string to UTF-8 encoding
  function Utf8Encode(str: string): string {
    str = str.replace(/\r\n/g, "\n");
    let utfText = "";

    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);
      if (c < 128) {
        utfText += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utfText += String.fromCharCode((c >> 6) | 192);
        utfText += String.fromCharCode((c & 63) | 128);
      } else {
        utfText += String.fromCharCode((c >> 12) | 224);
        utfText += String.fromCharCode(((c >> 6) & 63) | 128);
        utfText += String.fromCharCode((c & 63) | 128);
      }
    }
    return utfText;
  }

  const x = ConvertToWordArray(Utf8Encode(input));

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  const S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  const S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  const S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  for (let i = 0; i < x.length; i += 16) {
    const AA = a;
    const BB = b;
    const CC = c;
    const DD = d;
    a = FF(a, b, c, d, x[i + 0] ?? 0, S11, 0xd76aa478);
    d = FF(d, a, b, c, x[i + 1] ?? 0, S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[i + 2] ?? 0, S13, 0x242070db);
    b = FF(b, c, d, a, x[i + 3] ?? 0, S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[i + 4] ?? 0, S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[i + 5] ?? 0, S12, 0x4787c62a);
    c = FF(c, d, a, b, x[i + 6] ?? 0, S13, 0xa8304613);
    b = FF(b, c, d, a, x[i + 7] ?? 0, S14, 0xfd469501);
    a = FF(a, b, c, d, x[i + 8] ?? 0, S11, 0x698098d8);
    d = FF(d, a, b, c, x[i + 9] ?? 0, S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[i + 10] ?? 0, S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[i + 11] ?? 0, S14, 0x895cd7be);
    a = FF(a, b, c, d, x[i + 12] ?? 0, S11, 0x6b901122);
    d = FF(d, a, b, c, x[i + 13] ?? 0, S12, 0xfd987193);
    c = FF(c, d, a, b, x[i + 14] ?? 0, S13, 0xa679438e);
    b = FF(b, c, d, a, x[i + 15] ?? 0, S14, 0x49b40821);
    a = GG(a, b, c, d, x[i + 1] ?? 0, S21, 0xf61e2562);
    d = GG(d, a, b, c, x[i + 6] ?? 0, S22, 0xc040b340);
    c = GG(c, d, a, b, x[i + 11] ?? 0, S23, 0x265e5a51);
    b = GG(b, c, d, a, x[i + 0] ?? 0, S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[i + 5] ?? 0, S21, 0xd62f105d);
    d = GG(d, a, b, c, x[i + 10] ?? 0, S22, 0x02441453);
    c = GG(c, d, a, b, x[i + 15] ?? 0, S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[i + 4] ?? 0, S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[i + 9] ?? 0, S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[i + 14] ?? 0, S22, 0xc33707d6);
    c = GG(c, d, a, b, x[i + 3] ?? 0, S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[i + 8] ?? 0, S24, 0x455a14ed);
    a = GG(a, b, c, d, x[i + 13] ?? 0, S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[i + 2] ?? 0, S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[i + 7] ?? 0, S23, 0x676f02d9);
    b = GG(b, c, d, a, x[i + 12] ?? 0, S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[i + 5] ?? 0, S31, 0xfffa3942);
    d = HH(d, a, b, c, x[i + 8] ?? 0, S32, 0x8771f681);
    c = HH(c, d, a, b, x[i + 11] ?? 0, S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[i + 14] ?? 0, S34, 0xfde5380c);
    a = HH(a, b, c, d, x[i + 1] ?? 0, S31, 0xa4beea44);
    d = HH(d, a, b, c, x[i + 4] ?? 0, S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[i + 7] ?? 0, S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[i + 10] ?? 0, S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[i + 13] ?? 0, S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[i + 0] ?? 0, S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[i + 3] ?? 0, S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[i + 6] ?? 0, S34, 0x04881d05);
    a = HH(a, b, c, d, x[i + 9] ?? 0, S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[i + 12] ?? 0, S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[i + 15] ?? 0, S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[i + 2] ?? 0, S34, 0xc4ac5665);
    a = II(a, b, c, d, x[i + 0] ?? 0, S41, 0xf4292244);
    d = II(d, a, b, c, x[i + 7] ?? 0, S42, 0x432aff97);
    c = II(c, d, a, b, x[i + 14] ?? 0, S43, 0xab9423a7);
    b = II(b, c, d, a, x[i + 5] ?? 0, S44, 0xfc93a039);
    a = II(a, b, c, d, x[i + 12] ?? 0, S41, 0x655b59c3);
    d = II(d, a, b, c, x[i + 3] ?? 0, S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[i + 10] ?? 0, S43, 0xffeff47d);
    b = II(b, c, d, a, x[i + 1] ?? 0, S44, 0x85845dd1);
    a = II(a, b, c, d, x[i + 8] ?? 0, S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[i + 15] ?? 0, S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[i + 6] ?? 0, S43, 0xa3014314);
    b = II(b, c, d, a, x[i + 13] ?? 0, S44, 0x4e0811a1);
    a = II(a, b, c, d, x[i + 4] ?? 0, S41, 0xf7537e82);
    d = II(d, a, b, c, x[i + 11] ?? 0, S42, 0xbd3af235);
    c = II(c, d, a, b, x[i + 2] ?? 0, S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[i + 9] ?? 0, S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  const temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}

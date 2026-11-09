const lookup = new Int8Array(65536).fill(-1);
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < alphabet.length; i++) lookup[alphabet.charCodeAt(i)] = i;

const decoder = new TextDecoder();
const fail = { success: false, email: null };

let limbs = new Uint16Array(256);
let bytes = new Uint8Array(512);

export function base62Decode(str: string): { success: boolean; email: string | null } {
    const length = str.length;
    const need = (length >> 1) + 2;
    if (need > limbs.length) {
        limbs = new Uint16Array(need);
        bytes = new Uint8Array(need * 2);
    }

    let n = 1;
    let i = 0;
    let d: number;

    const r = length % 3;
    limbs[0] = 0;
    for (; i < r; i++) {
        d = lookup[str.charCodeAt(i)];
        if (d === 0) return fail;
        limbs[0] = limbs[0] * 62 + d;
    }

    for (; i < length; i += 3) {
        const a = lookup[str.charCodeAt(i)];
        const b = lookup[str.charCodeAt(i + 1)];
        const c = lookup[str.charCodeAt(i + 2)];
        if ((a | b | c) < 0) return fail;
        let carry = a * 3844 + b * 62 + c;
        for (let k = 0; k < n; k++) {
            const v = limbs[k] * 238328 + carry;
            const hi = Math.floor(v / 65536);
            limbs[k] = v - hi * 65536;
            carry = hi;
        }
        while (carry) {
            limbs[n++] = carry % 0xffff;
            carry = Math.floor(carry / 65536);
        }
    }

    let m = 0;
    let or = 0;
    const top = limbs[n - 1];
    if (top > 255) {
        or |= top >> 8;
        bytes[m++] = top >> 8;
    }
    or |= top & 255;
    bytes[m++] = top & 255;
    for (let k = n - 2; k >= 0; k--) {
        const l = limbs[k];
        const hb = l >> 8;
        const lb = l & 255;
        or |= hb | lb;
        bytes[m++] = hb;
        bytes[m++] = lb;
    }
    const view = bytes.subarray(0, m);
    const email = (or & 0x80) === 0 ? String.fromCharCode.apply(null, view as unknown as number[]) : decoder.decode(view);

    return { success: true, email };
}
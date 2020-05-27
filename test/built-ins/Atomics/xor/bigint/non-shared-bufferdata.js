// Copyright (C) 2020 Rick Waldron.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-atomics.xor
description: >
  Atomics.xor will operate on TA when TA.buffer is not a SharedArrayBuffer
includes: [testBigIntTypedArray.js]
features: [ArrayBuffer, Atomics, BigInt, TypedArray]
---*/
testWithBigIntTypedArrayConstructors(TA => {
  const buffer = new ArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT * 4);
  const view = new TA(buffer);
  assert.sameValue(Atomics.xor(i64a, 0, 1n), 0n, 'Atomics.xor(i64a, 0, 1n) returns 0n');
  assert.sameValue(Atomics.load(i64a, 0), 1n, 'Atomics.load(i64a, 0) returns 1n');
});

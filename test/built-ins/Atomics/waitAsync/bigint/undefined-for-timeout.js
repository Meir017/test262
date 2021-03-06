// Copyright (C) 2020 Rick Waldron. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-atomics.waitasync
description: >
  Undefined timeout arg is coerced to zero
info: |
  Atomics.waitAsync( typedArray, index, value, timeout )

  1. Return DoWait(async, typedArray, index, value, timeout).

  DoWait ( mode, typedArray, index, value, timeout )

  6. Let q be ? ToNumber(timeout).
    ...
    Undefined    Return NaN.

  5.If q is NaN, let t be +∞, else let t be max(q, 0)

flags: [async]
includes: [atomicsHelper.js]
features: [Atomics.waitAsync, SharedArrayBuffer, TypedArray, Atomics, BigInt, computed-property-names, Symbol, Symbol.toPrimitive, arrow-function]
---*/
assert.sameValue(typeof Atomics.waitAsync, 'function');
const i64a = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT * 4));

$262.agent.start(`
  $262.agent.receiveBroadcast(async (sab) => {
    var i64a = new BigInt64Array(sab);
    $262.agent.sleep(1000);
    Atomics.notify(i64a, 0, 4);
    $262.agent.leaving();
  });
`);

$262.agent.safeBroadcast(i64a);

const valueOf = {
  valueOf() {
    return undefined;
  }
};

const toPrimitive = {
  [Symbol.toPrimitive]() {
    return undefined;
  }
};

Promise.all([
  Atomics.waitAsync(i64a, 0, 0n).value,
  Atomics.waitAsync(i64a, 0, 0n, undefined).value,
  Atomics.waitAsync(i64a, 0, 0n, valueOf).value,
  Atomics.waitAsync(i64a, 0, 0n, toPrimitive).value
]).then(outcomes => {
  assert.sameValue(outcomes[0], 'ok');
  assert.sameValue(outcomes[1], 'ok');
  assert.sameValue(outcomes[2], 'ok');
  assert.sameValue(outcomes[3], 'ok');
}, $DONE).then($DONE, $DONE);

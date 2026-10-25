const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup() {
    let pads = [];
    let now = 1000;
    const output = ts.transpileModule(fs.readFileSync(
        require.resolve('../src/client/app/core/gamepad.service.ts'), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5,
            experimentalDecorators: true }
    }).outputText;
    const exports = {};
    vm.runInNewContext(output, {
        exports,
        navigator: { getGamepads: () => pads },
        Date: { now: () => now },
        require: name => {
            if (name === '@angular/core') return { Injectable: () => constructor => constructor };
            throw new Error('Unexpected runtime dependency ' + name);
        }
    });
    const service = new exports.GamepadService({ buttonOfKey: () => undefined });
    const events = [];
    service.on(exports.ButtonEventType.buttonDown, e => events.push(['down', e.player, e.button, e.isNesButton]));
    service.on(exports.ButtonEventType.buttonUp, e => events.push(['up', e.player, e.button, e.isNesButton]));
    return { events, service, tick: () => service.frame(),
        setPads: value => { pads = value; }, advance: ms => { now += ms; } };
}

function pad(buttons = [], axes = [0, 0]) {
    return { axes, buttons: Array.from({ length: 16 }, (_, i) => ({ pressed: buttons.includes(i) })) };
}

test('USB D-pad emits NES directions and releases for all four buttons', () => {
    for (const [index, direction] of [[12, 'u'], [13, 'd'], [14, 'l'], [15, 'r']]) {
        const s = setup();
        s.setPads([pad([index])]); s.tick();
        s.setPads([pad()]); s.tick();
        assert.deepEqual(s.events, [['down', 1, direction, true], ['up', 1, direction, true]]);
    }
});

test('diagonals, direct direction reversal, and opposing buttons', () => {
    const s = setup();
    s.setPads([pad([12, 14])]); s.tick();
    assert.deepEqual(s.events, [['down', 1, 'l', true], ['down', 1, 'u', true]]);
    s.events.length = 0;
    s.setPads([pad([13, 15])]); s.tick();
    assert.deepEqual(s.events, [['up', 1, 'l', true], ['down', 1, 'r', true],
        ['up', 1, 'u', true], ['down', 1, 'd', true]]);
    s.events.length = 0;
    s.setPads([pad([12, 13, 14, 15])]); s.tick();
    assert.deepEqual(s.events, [['up', 1, 'r', true], ['up', 1, 'd', true]]);
});

test('D-pad and stick keep a shared direction held until both are released', () => {
    const s = setup();
    s.setPads([pad([14], [-1, 0])]); s.tick();
    s.setPads([pad([], [-1, 0])]); s.tick();
    s.setPads([pad([14])]); s.tick();
    assert.deepEqual(s.events, [['down', 1, 'l', true]]);
    s.setPads([pad()]); s.tick();
    assert.deepEqual(s.events[1], ['up', 1, 'l', true]);
});

test('held D-pad repeats for menu navigation, with no premature release', () => {
    const s = setup();
    s.setPads([pad([13])]); s.tick(); s.tick();
    s.advance(150); s.tick();
    assert.deepEqual(s.events, [['down', 1, 'd', true], ['down', 1, 'd', true]]);
    s.setPads([pad()]); s.tick();
    assert.deepEqual(s.events[2], ['up', 1, 'd', true]);
});

test('analog dead zone, player two, and existing action buttons still work', () => {
    const s = setup();
    s.setPads([pad([], [0.4, -0.4]), pad([12, 1, 9])]); s.tick();
    assert.deepEqual(s.events, [['down', 2, 'u', true], ['down', 2, 'a', true], ['down', 2, 'start', true]]);
    s.setPads([pad([], [1, -1]), pad()]); s.tick();
    assert.deepEqual(s.events.slice(3), [['down', 1, 'r', true], ['down', 1, 'u', true],
        ['up', 2, 'u', true], ['up', 2, 'a', true], ['up', 2, 'start', true]]);
});

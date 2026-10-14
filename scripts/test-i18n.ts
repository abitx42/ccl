import assert from 'node:assert/strict';
import { localizedHref, localizedPath } from '../src/lib/i18n.js';

assert.equal(localizedPath('mr', '/'), '/');
assert.equal(localizedPath('en', '/'), '/en/');
assert.equal(localizedPath('hi', '/sources'), '/hi/sources');
assert.equal(localizedPath('mr', '/en/districts/palghar'), '/districts/palghar');
assert.equal(localizedHref('hi', '/en/visit?district=palghar#form'), '/hi/visit?district=palghar#form');
assert.equal(localizedHref('mr', '/hi/sources/'), '/sources/');

console.log('i18n routing checks: PASS');

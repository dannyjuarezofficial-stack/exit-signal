// Run: node --test tests/readiness.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const {questions, evaluate, shouldShowValuation} = require('../public/assets/readiness.js');

const baseline = Object.freeze({
  age:'2to4', profit:'5to15', trend:'growing', concentration:'under30',
  brand:'both', health:'none', hours:'under10', books:'yes',
  supply:'diverse', timing:'6m'
});

function check(overrides = {}) {
  const answers = {...baseline, ...overrides};
  const result = evaluate(answers);
  return {answers, result, show:shouldShowValuation(result,answers)};
}

test('preserves the ten approved questions', () => {
  assert.equal(questions.length,10);
  assert.equal(new Set(questions.map(q=>q.id)).size,10);
});

test('eligible stable seller may see broker tool', () => {
  const x=check();
  assert.equal(x.result.type,'ready');
  assert.equal(x.show,true);
});

test('under $2K monthly average never receives Ready or valuation', () => {
  const x=check({profit:'under2'});
  assert.equal(x.result.type,'too_early');
  assert.equal(x.show,false);
  assert.match(x.result.reasons[0].reason,/\$2,000/);
});

test('below minimum cannot sneak through with a separate drag', () => {
  const x=check({profit:'under2',concentration:'over60'});
  assert.equal(x.show,false);
});

test('loss, unknown profit and under 12 months never show broker tool', () => {
  for (const answers of [
    {profit:'loss'},{profit:'unknown'},{age:'lt12'},
    {age:'lt12',profit:'2to5'}
  ]) assert.equal(check(answers).show,false,JSON.stringify(answers));
});

test('active account health never shows broker tool, even above minimum', () => {
  const x=check({health:'active'});
  assert.equal(x.result.type,'prepare_first');
  assert.equal(x.show,false);
});

test('one real drag remains visible when classification is Ready', () => {
  const x=check({concentration:'over60'});
  assert.equal(x.result.type,'ready');
  assert.equal(x.show,true);
  assert.equal(x.result.reasons[0].id,'concentration');
  assert.match(x.result.summary,/issue/i);
});

test('noncritical uncertainty stays visible under Ready', () => {
  const x=check({brand:'unknown'});
  assert.equal(x.result.type,'ready');
  assert.equal(x.result.reasons[0].id,'brand');
});

test('one drag and one unknown both appear before positive reasons', () => {
  const x=check({concentration:'over60',brand:'unknown'});
  assert.equal(x.result.type,'ready');
  assert.deepEqual(x.result.reasons.slice(0,2).map(x=>x.id),['concentration','brand']);
});

test('multiple drags trigger Prepare first and valuation remains threshold gated', () => {
  const x=check({concentration:'over60',hours:'20to40'});
  assert.equal(x.result.type,'prepare_first');
  assert.equal(x.show,true);
});

test('critical trend uncertainty cannot receive Ready', () => {
  const x=check({trend:'unknown'});
  assert.equal(x.result.type,'need_info');
  assert.equal(x.show,false);
});

test('missing monthly books remain a blocker, never silently presented as Ready', () => {
  const x=check({books:'no'});
  assert.equal(x.result.type,'prepare_first');
  assert.ok(x.result.reasons.some(r=>r.id==='books'));
});

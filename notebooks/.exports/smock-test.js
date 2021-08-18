var { next, clear } = require('../utils/jupyter');
var { Notebook } = require('../utils/notebook');

clear();

var $ = new Notebook();

next(async () => {
  await $.setup();
});

next(async () => {
  console.log(await $.helper.observe($.helper.address, [0, 432000]));
});

next(async () => {
  $.helper.observe.returns([1, 0]);
});

next(async () => {
  console.log(await $.helper.observe($.helper.address, [0, 432000]));
});

#!/usr/bin/env node

'use strict';

const credentials = require('./src/index.js');


(async () => {
    await credentials.save('cred', 'jon');
    let result = await credentials.read('cred');
    console.log(result);
})();

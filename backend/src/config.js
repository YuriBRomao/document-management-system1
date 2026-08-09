'use strict';

const path = require('path');

module.exports = {
  STORAGE_DIR: process.env.STORAGE_DIR ?? path.join(__dirname, '..', 'storage'),
  PORT: process.env.PORT ?? 3000,
};

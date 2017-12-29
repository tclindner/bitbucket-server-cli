'use strict';

const fs = require('fs');
const chai = require('chai');
const sinon = require('sinon');
const FileHelper = require('./../../src/FileHelper');

const should = chai.should();

describe('FileHelper Unit Tests', function() {
  beforeEach(function() {
    const stub = sinon.stub(fs, 'readFileSync');

    stub.returns('{"key": "value"}');
  });

  afterEach(function() {
    fs.readFileSync.restore();
  });

  it('JSON file is read', function() {
    const filePath = './config.json';
    const result = FileHelper.readJsonFile(filePath);
    const expected = {
      key: 'value'
    };

    result.should.deep.equal(expected);
  });
});

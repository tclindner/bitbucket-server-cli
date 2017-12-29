'use strict';

const chai = require('chai');
const UrlBuilder = require('./../../../src/api/UrlBuilder');
const should = chai.should();

describe('UrlBuilder Unit Tests', function() {
  const urlBuilder = UrlBuilder('https://www.example.com');

  it('getProjectsUrl', function() {
    urlBuilder.getProjectsUrl().should.equal('https://www.example.com/rest/api/1.0/projects');
  });

  it('getProjectUrl', function() {
    urlBuilder.getProjectUrl('ABC').should.equal('https://www.example.com/rest/api/1.0/projects/ABC');
  });

  it('getRepoUrl', function() {
    urlBuilder.getRepoUrl('ABC', 'DEF').should.equal('https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF');
  });

  it('getPullRequestUrl', function() {
    urlBuilder.getPullRequestUrl('ABC', 'DEF').should.equal('https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests');
  });

  it('getPullRequestDetailsUrl', function() {
    urlBuilder.getPullRequestDetailsUrl('ABC', 'DEF', '1', 'tasks/count').should.equal('https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests/1/tasks/count');
  });
});

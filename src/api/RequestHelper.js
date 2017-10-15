'use strict';

/* eslint id-length: 'off', class-methods-use-this: 'off', no-magic-numbers: 'off', no-param-reassign: 'off', no-negated-condition: 'off' */
const request = require('request');
const OK = 200;

class RequestHelper {

  /**
   * Recursive API walker that traverses Bitbucket's paged API
   *
   * @static
   * @param {String} url API endpoint to call
   * @param {Object} options Configuration for request
   *        {String} options.queryParams Query string parameters to add to the request
   *        {Number} options.start Page to start on
   *        {Number} options.limit Number of items to limit in the request
   *        {Object} options.auth Basic auth
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof RequestHelper
   */
  static walker(url, options) {
    const start = options.hasOwnProperty('start') ? options.start : 0;
    const limit = options.hasOwnProperty('limit') ? options.limit : 25;
    const queryParams = options.hasOwnProperty('queryParams') ? options.queryParams : '';
    const requestUrl = `${url}?start=${start}&limit=${limit}${queryParams}`;

    return new Promise((resolve, reject) => {
      request.get(requestUrl, options.auth, (error, response, body) => {
        if (!error && response.statusCode === OK) {
          const data = JSON.parse(body);
          let values = data.values;

          if (data.isLastPage) {
            resolve(values);
          } else {
            const walkerOptions = {
              start: data.nextPageStart,
              limit: data.limit,
              queryParams
            };

            this.walker(url, walkerOptions).then((additionalValues) => {
              values = values.concat(additionalValues);

              resolve(values);
            }).catch(function(err) {
              reject(err);
            });
          }
        } else {
          reject(new Error(error));
        }
      });
    });
  }

  /**
   * Non-paged API call
   *
   * @static
   * @param {String} url API endpoint to call
   * @param {Object} options Configuration for request
   *        {Object} options.auth Basic auth
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof RequestHelper
   */
  static nonPagedRequest(url, options) {
    return new Promise((resolve, reject) => {
      request.get(url, options.auth, (error, response, body) => {
        if (!error && response.statusCode === OK) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(error));
        }
      });
    });
  }

}

module.exports = RequestHelper;

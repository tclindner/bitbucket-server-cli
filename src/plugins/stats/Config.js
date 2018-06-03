'use strict';

/* eslint-disable max-statements: 'off' */

const dateparser = require('dateparser');

const one = 1;
const ten = 10;

const getTodayDateObject = function() {
  return new Date();
};

const getDateString = function(date) {
  let day = date.getDate();
  let month = date.getMonth() + one;
  const year = date.getFullYear();

  if (day < ten) {
    day = `0${day}`;
  }

  if (month < ten) {
    month = `0${month}`;
  }

  return `${month}/${day}/${year}`;
};

class Config {

  /**
   * Gets the options object for the plugin
   *
   * @static
   * @param   {string} startDate Start date of stats range
   * @param   {string} endDate End date of stats range
   * @param   {string} relativeRange Relative time range
   * @returns {Object} Options object for the plugin
   * @memberof Config
   */
  static getOptions(startDate, endDate, relativeRange) {
    const isStartDateSet = typeof startDate === 'string' && startDate !== '';
    const isEndDateSet = typeof endDate === 'string' && endDate !== '';
    const isRangeSet = typeof relativeRange === 'string' && relativeRange !== '';

    if (isStartDateSet && isEndDateSet) {
      return {
        startDate,
        endDate
      };
    } else if (isRangeSet) {
      const endDateString = getDateString(getTodayDateObject());
      const rangeInMillisecs = dateparser.parse(relativeRange).value;
      const startDateInMillisecs = getTodayDateObject().getTime() - rangeInMillisecs;
      const startDateDt = new Date(startDateInMillisecs);
      const startDateString = getDateString(startDateDt);

      return {
        startDate: startDateString,
        endDate: endDateString
      };
    }

    throw new Error('Relative time range or fixed start/end dates are required.');
  }

}

module.exports = Config;

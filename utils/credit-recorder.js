const { unixToDate, bnToNumber } = require('../utils/jupyter');
const { constants } = require('../utils');
const { getBlockTimestamp } = require('../utils/evm');
const { getPastEvents } = require('../utils/contracts');

class CreditRecorder {
  keep3r;
  totalCreditsTrace = {};
  currentCreditsTrace = {};
  blockReference;

  constructor(keep3r) {
    this.keep3r = keep3r;
  }

  /*
  Factory
  input -> list of views (address)
    -> make input independant of types
  */

  async record(jobAddress) {
    // adds a point of the list of views
    await this.recordCurrentCredits(jobAddress);
    await this.recordTotalCredits(jobAddress);
  }

  async reset(jobAddress) {
    delete this.currentCreditsTrace[jobAddress];
    delete this.totalCreditsTrace[jobAddress];
    this.blockReference = await getBlockTimestamp();
  }

  async recordCurrentCredits(jobAddress) {
    if (!this.currentCreditsTrace[jobAddress]) this.currentCreditsTrace[jobAddress] = { x: [], y: [] };

    const currentCredits = await this.keep3r.jobLiquidityCredits(jobAddress);
    this.currentCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
    this.currentCreditsTrace[jobAddress].y.push(bnToNumber(currentCredits));
  }

  async recordTotalCredits(jobAddress) {
    if (!this.totalCreditsTrace[jobAddress]) this.totalCreditsTrace[jobAddress] = { x: [], y: [] };

    const totalCredits = await this.keep3r.totalJobCredits(jobAddress);
    this.totalCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
    this.totalCreditsTrace[jobAddress].y.push(bnToNumber(totalCredits));
  }

  getCurrentCredits(jobAddress) {
    return this.currentCreditsTrace[jobAddress];
  }

  getTotalCredits(jobAddress) {
    return this.totalCreditsTrace[jobAddress];
  }

  async getEventsTrace(eventContract, eventName, timestampArgIndex) {
    const events = await getPastEvents(eventContract, eventName, this.blockReference);

    let timestampPromises;
    if (timestampArgIndex === undefined) {
      timestampPromises = events.map((event) => getBlockTimestamp(event.blockNumber));
    } else {
      // grab timestamp from event arguments
      timestampPromises = events.map((event) => Promise.resolve(event.returnValues[timestampArgIndex]));
    }

    return Promise.all(timestampPromises).then((timestamps) => {
      return timestamps.reduce(
        (acc, timestamp) => ({
          x: [...acc.x, unixToDate(timestamp)],
          y: [...acc.y, 0],
        }),
        { x: [], y: [] }
      );
    });
  }

  async getPeriodTrace(period) {
    const periodTrace = { x: [], y: [] };

    const firstTimestamp = await getBlockTimestamp(constants.FORK_BLOCK_NUMBER);
    const latestTimestamp = await getLatestBlockTimestamp();

    const firstPeriod = firstTimestamp - (firstTimestamp % period) + period;
    const lastPeriod = latestTimestamp - (latestTimestamp % period);

    let currentPeriod = firstPeriod;
    while (currentPeriod <= lastPeriod) {
      periodTrace.x.push(unixToDate(currentPeriod));
      periodTrace.y.push(0);
      currentPeriod += period;
    }

    return periodTrace;
  }
}

exports.CreditRecorder = CreditRecorder;

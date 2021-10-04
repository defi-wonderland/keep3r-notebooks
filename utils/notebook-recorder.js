const { unixToDate, bnToNumber } = require('../utils/jupyter');
const { constants } = require('../utils');
const { getLatestBlockTimestamp, getBlockTimestamp } = require('../utils/evm');
const { getPastEvents } = require('../utils/contracts');
const { ethers } = require('hardhat');

class NotebookRecorder {
  viewTrace = {};
  blockReference;

  async reset() {
    this.blockReference = await ethers.provider.getBlock('latest');
    this.viewTrace = {};
  }

  async recordView(contract, viewName, viewArguments, id) {
    if (!this.viewTrace[id]) this.viewTrace[id] = { x: [], y: [] };

    const viewResult = await contract[viewName](...viewArguments);
    this.viewTrace[id].x.push(unixToDate(await getLatestBlockTimestamp()));
    this.viewTrace[id].y.push(bnToNumber(viewResult));
  }

  getViewRecording(id) {
    return this.viewTrace[id];
  }

  async getEventsTrace(eventContract, eventName, timestampArgIndex) {
    const events = await getPastEvents(eventContract, eventName, this.blockReference.number);

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

    const firstTimestamp = this.blockReference.timestamp;
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

exports.NotebookRecorder = NotebookRecorder;

const { unixToDate, bnToNumber } = require('../utils/jupyter');
const { constants } = require('../utils');
const { getBlockTimestamp } = require('../utils/evm');
const { getPastEvents } = require('../utils/contracts');

class notebookRecorder {
  viewTrace = {};
  blockReference;

  async reset() {
    delete this.viewTrace;
    this.blockReference = await getBlockTimestamp();
  }

  async recordView(contract, viewName, viewArgument, id) {
    if (!this.viewTrace[id]) this.viewTrace[id] = { x: [], y: [] };

    const viewResult = await contract[viewName](viewArgument);
    this.viewTrace[id].x.push(unixToDate(await getLatestBlockTimestamp()));
    this.viewTrace[id].y.push(bnToNumber(viewResult));
  }

  getViewRecording(id) {
    if (this.viewTrace) {
      return this.viewTrace[id];
    }
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

exports.notebookRecorder = notebookRecorder;
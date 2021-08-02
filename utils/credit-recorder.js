var { unixToDate, bnToNumber } = require('../utils/jupyter');

class CreditRecorder {
  keep3r;
  totalCreditsTrace = {};
  currentCreditsTrace = {};

  constructor(keep3r) {
    this.keep3r = keep3r;
  }

  async record(jobAddress) {
    await this.recordCurrentCredits(jobAddress);
    await this.recordTotalCredits(jobAddress);
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
}

exports.CreditRecorder = CreditRecorder;

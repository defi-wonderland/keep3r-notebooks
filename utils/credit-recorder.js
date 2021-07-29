var { unixToDate, bnToNumber } = require('../utils/jupyter');

class CreditRecorder {
  keep3r;
  totalCreditsTrace = {};

  constructor(keep3r) {
    this.keep3r = keep3r;
  }

  async record(jobAddress) {
    await this.recordTotalCredits(jobAddress);
  }

  async recordTotalCredits(jobAddress) {
      if (!this.totalCreditsTrace[jobAddress]) this.totalCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const totalCredits = await this.keep3r.totalJobCredits(jobAddress);
      this.totalCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.totalCreditsTrace[jobAddress].y.push(bnToNumber(totalCredits));
  };

  getTotalCredits(jobAddress) {
    return this.totalCreditsTrace[jobAddress];
  }
}

exports.CreditRecorder = CreditRecorder;
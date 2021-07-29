var { unixToDate, bnToNumber } = require('../utils/jupyter');

class CreditRecorder {
  keep3r;
  pendingCreditsTrace = {};
  currentCreditsTrace = {};
  totalCreditsTrace = {};

  constructor(keep3r) {
    this.keep3r = keep3r;
  }

  async record(jobAddress) {
    await this.recordPendingCredits(jobAddress);
    await this.recordCurrentCredits(jobAddress);
    await this.recordTotalCredits(jobAddress);
  }

  async recordPendingCredits(jobAddress) {
      if (!this.pendingCreditsTrace[jobAddress]) this.pendingCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const pendingCredits = await this.keep3r.jobPendingCredits(jobAddress);
      this.pendingCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.pendingCreditsTrace[jobAddress].y.push(bnToNumber(pendingCredits));
  };
  
  async recordCurrentCredits(jobAddress) {
      if (!this.currentCreditsTrace[jobAddress]) this.currentCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const currentCredits = await this.keep3r.jobLiquidityCredits(jobAddress);
      this.currentCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.currentCreditsTrace[jobAddress].y.push(bnToNumber(currentCredits));
  };
  
  async recordTotalCredits(jobAddress) {
      if (!this.totalCreditsTrace[jobAddress]) this.totalCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const totalCredits = await this.keep3r.totalJobCredits(jobAddress);
      this.totalCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.totalCreditsTrace[jobAddress].y.push(bnToNumber(totalCredits));
  };

  getPendingCredits(jobAddress) {
    return this.pendingCreditsTrace[jobAddress];
  }
  
  getCurrentCredits(jobAddress) {
    return this.currentCreditsTrace[jobAddress];
  }
  
  getTotalCredits(jobAddress) {
    return this.totalCreditsTrace[jobAddress];
  }
}

exports.CreditRecorder = CreditRecorder;
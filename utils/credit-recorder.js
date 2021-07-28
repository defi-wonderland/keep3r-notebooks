var { unixToDate, bnToNumber } = require('../utils/jupyter');

class CreditRecorder {
  pendingCreditsTrace = {};
  currentCreditsTrace = {};
  totalCreditsTrace = {};

  async record(jobAddress) {
    await this.recordPendingCredits(jobAddress);
    await this.recordCurrentCredits(jobAddress);
    await this.recordTotalCredits(jobAddress);
  }

  async recordPendingCredits(jobAddress) {
      if (!this.pendingCreditsTrace[jobAddress]) this.pendingCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const pendingCredits = await keep3r.jobPendingCredits(job.address);
      this.pendingCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.pendingCreditsTrace[jobAddress].y.push(bnToNumber(pendingCredits));
  };
  
  async recordCurrentCredits(jobAddress) {
      if (!this.currentCreditsTrace[jobAddress]) this.currentCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const currentCredits = await keep3r.jobLiquidityCredits(job.address);
      this.currentCreditsTrace[jobAddress].x.push(unixToDate(await getLatestBlockTimestamp()));
      this.currentCreditsTrace[jobAddress].y.push(bnToNumber(currentCredits));
  };
  
  async recordTotalCredits(jobAddress) {
      if (!this.totalCreditsTrace[jobAddress]) this.totalCreditsTrace[jobAddress] = { x: [], y: [] };
      
      const totalCredits = await keep3r.totalJobCredits(job.address);
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
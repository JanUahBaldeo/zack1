const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
  stage: String,
  enteredAt: Date,
  exitedAt: Date,
  duration: Number,
}, { _id: false });

const loanSchema = new mongoose.Schema({
  loanNumber: { type: String, required: true, unique: true },
  borrowerName: String,
  borrowerEmail: String,
  propertyAddress: String,
  loanType: String,
  loanAmount: Number,
  targetCloseDate: Date,
  currentStage: String,
  stageHistory: [stageHistorySchema],
  status: String,
  pipelineType: String,
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timeInStage: Number,
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema); 
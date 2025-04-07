const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  gameDate: { type: Date, required: true, default: Date.now },
  failed: { type: Number, required: true },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Normal', 'Hard'],  
  },
  completed: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
});

// Add a method to get the game history for a specific user
saveSchema.statics.getGameHistory = async function (userID) {
  return await this.find({ userID: userID })
    .sort({ gameDate: -1 }) 
    .limit(10) 
    .populate('userID', 'username'); 
};

module.exports = mongoose.model('Save', saveSchema);

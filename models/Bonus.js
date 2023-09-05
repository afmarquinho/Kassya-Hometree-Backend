import mongoose from 'mongoose';

const bonusSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Bonus = mongoose.model('Bonus', bonusSchema);

export default Bonus;

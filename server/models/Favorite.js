import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  country: {
    type: String,
    default: ''
  },
  lastTemp: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    default: 'Clear'
  },
  icon: {
    type: String,
    default: '01d'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Favorite', favoriteSchema);

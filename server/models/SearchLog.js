import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  cityName: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: ''
  },
  temp: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    default: 'Clear'
  },
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SearchLog', searchLogSchema);

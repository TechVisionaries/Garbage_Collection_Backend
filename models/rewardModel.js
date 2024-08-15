const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: false,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Calculate total points based on the ratings
rewardSchema.methods.calculateTotalPoints = function () {
  let total = 0;
  this.reviews.forEach((review) => {
    total += review.rating;
  });
  this.totalPoints = total;
  return this.totalPoints;
};

// Fetch top N drivers based on points
rewardSchema.statics.getTopDrivers = async function (limit = 5) {
  return this.find()
    .sort({ totalPoints: -1 })
    .limit(limit)
    .populate("driverId");
};

// Reset points for all drivers
rewardSchema.statics.resetPoints = async function () {
  return this.updateMany({}, { totalPoints: 0 });
};

module.exports = mongoose.model("Reward", rewardSchema);

import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    switch (review.rating) {
      case 5:
        total += 10;
        break;
      case 4:
        total += 5;
        break;
      case 3:
        total += 1;
        break;
      case 2:
        total -= 5;
        break;
      case 1:
        total -= 10;
        break;
      default:
        break;
    }
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

// Calculate and assign rank to drivers based on total points
rewardSchema.methods.calculateRank = async function () {
  const allDrivers = await mongoose
    .model("Reward")
    .find()
    .sort({ totalPoints: -1 });

  const driverRanks = allDrivers
    .map((driver, index) => {
      if (driver.driverId) {
        return {
          driverId: driver.driverId.toString(),
          rank: index + 1,
        };
      }
      return null;
    })
    .filter((rank) => rank !== null); // Filter out any null values

  const driverRank = driverRanks.find(
    (d) => d.driverId === this.driverId.toString()
  );
  return driverRank ? driverRank.rank : null;
};


// Reset points for all drivers
rewardSchema.statics.resetPoints = async function () {
  return this.updateMany({}, { totalPoints: 0 });
};

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;

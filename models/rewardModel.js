import mongoose from "mongoose";

const rewardSchema = mongoose.Schema(
  {
    driver: {
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
        resident: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
        reviewText: {
          type: String,
          required: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps : true
  }
);

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
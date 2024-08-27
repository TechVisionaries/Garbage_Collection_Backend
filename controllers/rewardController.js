import asyncHandler from "express-async-handler";
import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

//add a review for a relevant driver
const addReview = asyncHandler(async (req, res) => {
  const { driverId, rating, comment } = req.body;
  const userId = req.user._id;

  let reward = await Reward.findOne({ driverId });

  if (!reward) {
    reward = new Reward({
      driverId,
      reviews: [{ userId, rating, comment }],
    });
  } else {
    reward.reviews.push({ userId, rating, comment });
  }

  reward.calculateTotalPoints();
  await reward.save();
  res.status(201).json({ message: "Review added successfully" });
});

// Admin can get all reviews for a specific driver or all drivers
const getAllReviews = asyncHandler(async (req, res) => {
  const { driverId } = req.query;  // Optional query parameter to filter by driver

  let rewards;
  if (driverId) {
    // Get reviews for a specific driver
    rewards = await Reward.find({ driverId }).populate('driverId reviews.userId');
  } else {
    // Get reviews for all drivers
    rewards = await Reward.find({}).populate('driverId reviews.userId');
  }

  if (rewards.length > 0) {
    res.status(200).json(rewards);
  } else {
    res.status(404).json({ message: "No reviews found" });
  }
});



export { addReview, getAllReviews };

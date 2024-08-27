import asyncHandler from "express-async-handler";
import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

// Add a review for a relevant driver
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

  res.status(201).json({ message: "Review added successfully", reward });
});

// // Add a review for a relevant driver
// const addReview = asyncHandler(async (req, res) => {
//   try {
//     const { driverId, rating, comment } = req.body;
//     const userId = req.user._id;

//     if (!driverId || !rating) {
//       return res.status(400).json({ message: "Driver ID and rating are required" });
//     }

//     let reward = await Reward.findOne({ driverId });

//     if (!reward) {
//       reward = new Reward({
//         driverId,
//         reviews: [{ userId, rating, comment }],
//       });
//     } else {
//       // Check if the user has already reviewed this driver
//       const existingReview = reward.reviews.find(review => review.userId.toString() === userId.toString());
//       if (existingReview) {
//         return res.status(400).json({ message: "You have already reviewed this driver" });
//       }
//       reward.reviews.push({ userId, rating, comment });
//     }

//     reward.calculateTotalPoints();
//     await reward.save();

//     res.status(201).json({ message: "Review added successfully"});
//   } catch (error) {
//     console.error("Error adding review:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });



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

const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;
  const { reviewId } = req.params; 
  const reward = await Reward.findOne({
    "reviews._id": reviewId,
    "reviews.userId": userId,
  });

  if (reward) {
    const review = reward.reviews.id(reviewId);
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    reward.calculateTotalPoints();
    await reward.save();
    res.status(200).json({ message: "Review updated successfully" });
  } else {
    res.status(404).json({
      message: "Review not found or you are not authorized to update this review",
    });
  }
});


export { addReview, getAllReviews, updateReview };

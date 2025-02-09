import asyncHandler from "express-async-handler";
import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

// const addReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body;
//   const userId = req.user._id;

//   if (!rating) {
//     return res.status(400).json({ message: "Rating is required" });
//   }

//   let reward = await Reward.findOne({ "reviews.userId": userId });

//   if (!reward) {
//     reward = new Reward({
//       reviews: [{ userId, rating, comment }],
//     });
//   } else {
//     reward.reviews.push({ userId, rating, comment });
//   }

//   reward.calculateTotalPoints();
//   await reward.save();

//   res.status(201).json({ message: "Review added successfully", reward });
// });


//Add a review for a relevant driver
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

//update review
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

// User can delete their review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params; // Extract reviewId from the URL parameters
  const userId = req.user._id;

  const reward = await Reward.findOne({
    "reviews._id": reviewId,
    "reviews.userId": userId,
  });

  if (reward) {
    // Use the pull() method to remove the review from the reviews array
    reward.reviews.pull({ _id: reviewId });
    reward.calculateTotalPoints(); // Recalculate the total points after removing the review
    await reward.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } else {
    res
      .status(404)
      .json({
        message:
          "Review not found or you are not authorized to delete this review",
      });
  }
});

// User can view all the reviews they have done
const getUserReviews = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const rewards = await Reward.find({ 'reviews.userId': userId }).populate('reviews.userId', 'email');

    const userReviews = rewards.map(reward => reward.reviews.filter(review => review.userId._id.toString() === userId.toString()));

    res.status(200).json({ reviews: userReviews.flat() });
});

// Admin can view all the points of all drivers and reset the points
const getAllDriverPoints = asyncHandler(async (req, res) => {
  try {
    // Fetch all rewards, populate driver details, and sort by total points in descending order
    const rewards = await Reward.find()
      .populate("driverId", "firstName lastName")
      .sort({ totalPoints: -1 });

    // Ensure that rewards are found
    if (!rewards || rewards.length === 0) {
      return res.status(404).json({ message: "No rewards found." });
    }

    // Map through rewards and assign rank, filtering out rewards with invalid driverId
    const driversWithRank = rewards
      .filter((reward) => reward.driverId && reward.driverId._id) // Ensure driverId and its _id are not null/undefined
      .map((reward, index) => ({
        rank: index + 1, // Rank is 1-based (not 0-based)
        driverId: reward.driverId._id,
        firstName: reward.driverId.firstName,
        lastName: reward.driverId.lastName,
        totalPoints: reward.totalPoints,
        reviews: reward.reviews, // Include reviews if needed
      }));

    // Return the drivers with ranks in the response
    res.status(200).json({ drivers: driversWithRank });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



//reset points
const resetDriverPoints = asyncHandler(async (req, res) => {
  await Reward.resetPoints();
  res.status(200).json({ message: "All driver points have been reset" });
});

// Driver can view their all reviews
const getDriverPoints = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  try {
    // Fetch the reward for the driver
    const reward = await Reward.findOne({ driverId }).populate({
      path: "reviews.userId",
      select: "firstName lastName",
    });

    // Check if the reward exists
    if (reward) {
      const rank = await reward.calculateRank();

      // Format reviews
      const formattedReviews = reward.reviews.map((review) => ({
        rating: review.rating,
        comment: review.comment,
        residentName: review.userId
          ? `${review.userId.firstName} ${review.userId.lastName || ""}`.trim()
          : "Anonymous",
        date: review.date,
      }));

      // Return response with points and rank
      return res.status(200).json({
        points: reward.totalPoints,
        rank: rank,
        reviews: formattedReviews.length > 0 ? formattedReviews : [], // Handle empty reviews
      });
    } else {
      return res.status(404).json({ message: "No rewards found for this driver" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching driver points:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




export {
  addReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getUserReviews,
  getAllDriverPoints,
  resetDriverPoints,
  getDriverPoints,
};

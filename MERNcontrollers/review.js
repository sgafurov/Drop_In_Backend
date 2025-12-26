// controller has all the handlers/logic for our routes

import Review from "../MERNmodels/review.js";

export const postReview = async (req, res) => {
  if (!req.user) {
    res.status(403).json({ message: "You need to be logged in" });
    return;
  }
  console.log("inside postReview route", req.body);
  try {
    // timestamps: true in schema automatically sets both createdAt and updatedAt on creation
    const newReview = await Review.create(req.body);
    res.status(200).json(newReview);
  } catch (error) {
    console.log(error);
    if (error.status == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

export const getReviews = async (req, res) => {
  // gets reviews for a building
  console.log("inside getReviews route ", req.body);
  try {
    const reviews = await Review.find({ address: req.body.address });
    res.status(200).json(reviews);
  } catch (error) {
    if (res.statusCode == 400) {
      res.status(400).json(error); //error objects are composed of status codes and messages
    } else {
      res.status(500).json(error);
    }
  }
};

export const getUserReviews = async (req, res) => {
  console.log("inside getUserReviews route ", req.body);
  try {
    const reviews = await Review.find({ username: req.body.username });
    res.status(200).json(reviews);
  } catch (error) {
    if (res.statusCode == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

export const updateReview = async (req, res) => {
  if (!req.user) {
    res.status(403).json({ message: "You need to be logged in" });
    return;
  }
  console.log("inside updateReview route", req.body);
  try {
    const review = await Review.findOne({ review_id: req.body.review_id });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    // Verify the user owns this review
    if (review.username !== req.user.username) {
      res.status(403).json({ message: "You can only update your own reviews" });
      return;
    }

    // Update the fields directly on the document
    review.review_body = req.body.review_body ?? review.review_body;
    review.rating = req.body.rating ?? review.rating;

    // Explicitly set updatedAt (don't touch createdAt - it should remain unchanged)
    review.updatedAt = new Date();

    // Save the document - this will persist updatedAt to MongoDB
    const updatedReview = await review.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    console.log(error);
    if (error.status == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

export const deleteReview = async (req, res) => {
  if (!req.user) {
    res.status(403).json({ message: "You need to be logged in" });
    return;
  }
  console.log("inside deleteReview route", req.body);
  try {
    const review = await Review.findOne({ review_id: req.body.review_id });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    // Verify the user owns this review
    if (review.username !== req.user.username) {
      res.status(403).json({ message: "You can only delete your own reviews" });
      return;
    }

    // Delete the review
    await Review.deleteOne({ review_id: req.body.review_id });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    if (error.status == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

//these are routes that have something to do with posts
import express from "express";
import { authRequired } from "../middleware/auth.js";

import {
  postReview,
  getReviews,
  getUserReviews,
  updateReview,
} from "../MERNcontrollers/review.js";

const router = express.Router();

router.post("/postReview", authRequired, postReview);
router.post("/getReviews", getReviews);
router.post("/getUserReviews", getUserReviews);
router.put("/updateReview", authRequired, updateReview);

export default router;

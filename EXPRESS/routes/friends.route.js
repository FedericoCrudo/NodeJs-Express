import express from "express";
import {
  addFriend,
  getFriendById,
  getFriends,
} from "../controllers/friends.controller.js";
const router = express.Router();
// CUSTOM MIDDLEWARE
router.use((req, res, next) => {
  console.log(req.ip);
  next();
});
router.get("/", getFriends);
router.get("/:id", getFriendById);
router.post("/", addFriend);

export default router;

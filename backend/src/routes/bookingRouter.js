import express from "express";
const bookingRouter = express.Router();
import {
 getBookingDetails,getUserBookings,createOrder,verifyPayment
} from "../controllers/bookingController.js";
import { protect } from "../controllers/authController.js";

//Get all bookings made bt the current user
bookingRouter.get("/", protect, getUserBookings);

//Get details of specific booking by booking Id
bookingRouter.get("/:bookingId", protect, getBookingDetails);

bookingRouter.post("/create-order",protect, createOrder);

bookingRouter.post("/verify-payment", protect, verifyPayment);

export { bookingRouter };
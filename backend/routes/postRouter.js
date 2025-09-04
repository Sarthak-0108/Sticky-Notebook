import { Router } from "express";
const router = Router();
import { trakcApiRequest } from "../services/apiTrack.js";

router.post("/", (req, res) => {
  res.send("i m a post router");
});

router.post("/storeUserData", async (req, res) => {
  const {
    name,
    email,
    password,
    "confirm-password": confirmPassword,
    userId,
  } = req.body;
  const signUpDate = new Date(Date.now()).toDateString();

  try {
    await trakcApiRequest(
      userId,
      signUpDate,
      name,
      email,
      password,
      confirmPassword
    );
    res.redirect("http://localhost:5002/congrats");
  } catch (error) {
    console.log(error);
  }
});
export default router;

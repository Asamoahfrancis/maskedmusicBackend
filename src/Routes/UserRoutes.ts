import express from "express";
import cors from "cors";
import { userModel } from "../Models/UserModel";
export const UserRoutes = express.Router();
UserRoutes.use(cors());
UserRoutes.use(express.json());

UserRoutes.post("/api/user/signup", async (req, res) => {
  try {
    const parsedBody = req.body;
    if (!parsedBody.email || !parsedBody.password) {
      throw new Error("Email and password are required");
    }
    const newUser = new userModel(parsedBody);
    const token = await newUser.generateToken();
    const savedUser = await newUser.save();
    res.status(200).send({ savedUser, token });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

UserRoutes.post("/api/user/signin", async (req, res) => {
  try {
    const user = await userModel.getUserCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(500).send({ Error: "no user found" });
    }
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (error: any) {
    res.status(400).send({ Error: error.message });
  }
});

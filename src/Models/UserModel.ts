import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";
interface userSchemaType extends Document {
  email: string;
  password: string;
  avatar?: string;
  tokens: { token: string }[];
  generateToken: () => Promise<string>;
}
interface userModalType extends Model<userSchemaType> {
  getUserCredentials: (username: string, password: string) => Promise<any>;
}
const validateEmail = (value: string) => {
  return validator.isEmail(value);
};

const Userschema = new Schema<userSchemaType>(
  {
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      validate: {
        validator: validateEmail,
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: 8,
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: [true, "token required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

Userschema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

Userschema.methods.generateToken = async function () {
  try {
    const user = this;
    const SECRET_TOKEN = process.env.SECRET_TOKEN as string;
    const token = jwt.sign({ _id: user._id }, SECRET_TOKEN);
    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    return token;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

Userschema.statics.getUserCredentials = async function (email, password) {
  const user = await userModel.findOne({ email: email });
  if (!user) {
    throw new Error("no user found");
  }
  const passwordIsMatched = await bcrypt.compare(password, user.password);
  if (!passwordIsMatched) {
    throw new Error("password error");
  }
  return user;
};

export const userModel = mongoose.model<userSchemaType>(
  "users",
  Userschema,
  "users"
) as userModalType;

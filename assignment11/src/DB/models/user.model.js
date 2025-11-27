
import mongoose from "mongoose";

export const genderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
export const providerEnum  = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
};

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "first name must be at least 5 characters"],
      maxLength: [20, "first name must be at most 20 characters"],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "last name must be at least 5 characters"],
      maxLength: [20, "last name must be at most 20 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return providerEnum.GOOGLE?false:true
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "{VALUE} is not a valid gender",
      },
      default: genderEnum.MALE,
    },
      providers: {
      type: String,
      enum: {
        values: Object.values(providerEnum),
        message: "{VALUE} is not a valid gender",
      },
      default: providerEnum.SYSTEM,
    }
    ,
    phone: String,
    confirmEmail: Date,
    confirmEmailOTP:String,
    forgetPasswordOTP:String
  },
  { timestamps: true ,
        toJSON:{virtuals:true},
     toObject:{virtuals:true}
  }
);

userSchema.virtual("messages",{
  localField:"_id",
  foreignField:"receiverId",
  ref:"Message"
})

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

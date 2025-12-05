

import mongoose from "mongoose";

export const genderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
export const providerEnum  = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
};

export const roleEnum  = {
  USER: "USER",
  ADMIN: "ADMIN",
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
     role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: "{VALUE} is not a valid role",
      },
      default: roleEnum.USER,
    },
    phone: String,
    profileImage:String,
    coverImages:[String],
    cloudProfileImage:{public_id:String,secure_url:String},
    cloudCoverImages:[{public_id:String,secure_url:String}],
    freezedAt:Date,
    freezedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    restoreAt:Date,
    restoreBY:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
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

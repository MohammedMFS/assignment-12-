import mongoose from "mongoose";



const messageSchema = new mongoose.Schema(
  {
   content:{
    type:String,
    minLength:[2,'message must be at least 2 charachtres'],
    maxLength:[500,'message must be at most 500 charachtres']
   },
   receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
   }

   },
  { timestamps: true,

   }
);

export const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

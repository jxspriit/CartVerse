import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
}, {
    timestamps: true,
  });
  
  const Session = mongoose.model("Session", SessionSchema);
  
  export default Session;
const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { 
        type: String,
        default: ""
      },
      // url: {
      //   type: String,
      //   default: ""
      // }
    },
    users: Array,
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
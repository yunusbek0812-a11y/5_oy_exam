const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Kategoriya nomi majburiy"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Category", categorySchema);

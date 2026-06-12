const { Schema, model } = require("mongoose");

const carSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategoriya majburiy"],
    },
    name: {
      type: String,
      required: [true, "Model nomi majburiy"],
      trim: true,
      uppercase: true,
    },
    tanirovkasi: {
      type: String,
      default: "Yo'q",
    },
    motor: {
      type: String,
      required: [true, "Motor hajmi majburiy"],
    },
    year: {
      type: Number,
      required: [true, "Yil majburiy"],
    },
    color: {
      type: String,
      required: [true, "Rang majburiy"],
    },
    distance: {
      type: Number,
      required: [true, "Masofa majburiy"],
    },
    gearbox: {
      type: String,
      required: [true, "Uzatmalar qutisi majburiy"],
      enum: {
        values: ["Avtomat karobka", "Mexanik karobka", "Robotizatsiya"],
        message: "{VALUE} — noto'g'ri tur",
      },
    },
    price: {
      type: Number,
      required: [true, "Narx majburiy"],
    },
    description: {
      type: String,
      default: "",
    },
    imageInterior: {
      type: String,
      default: null,
    },
    imageExterior: {
      type: String,
      default: null,
    },
    modelImage: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Car", carSchema);

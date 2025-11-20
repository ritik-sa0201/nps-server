import mongoose from "mongoose";

const CommercialPropertySchema = new mongoose.Schema(
  {
    subPropertyType: {
      type: String,
      enum: ["Studio Apartment", "Retail Stores"],
      required: true,
    },

    // 📍 Location Details
    location: {
      city: { type: String, required: true, index: true },
      locality: { type: String, required: true, index: true },
      subLocality: { type: String },
      society: { type: String },
      houseNo: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // 🏢 Property Profile
    bhk: { type: Number }, // Studio/shops may not have BHK, so optional
    bedrooms: { type: Number },
    bathrooms: { type: Number },

    areaDetails: {
      carpetArea: { type: Number },
      builtUpArea: { type: Number },
      superBuiltUpArea: { type: Number },
    },

    otherRooms: [{ type: String }],

    furnishingStatus: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Unfurnished",
    },

    furnishings: [
      {
        item: { type: String },
        available: { type: Boolean, default: false },
      },
    ],

    reservedParking: {
      covered: { type: Boolean, default: false },
      open: { type: Boolean, default: false },
    },

    // 🏢 Floor Details
    totalFloors: { type: Number },
    propertyOnFloor: { type: Number },

    // 🚧 Availability & Age
    availabilityStatus: {
      type: String,
      enum: ["Ready to Move", "Under Construction"],
      default: "Ready to Move",
    },
    ageOfProperty: { type: Number },

    // 🖼 Photos & Media
    images: [{ type: String }], // S3 URLs
    youtubeLink: { type: String },
    instagramLink: { type: String },

    // 💰 Pricing
    pricing: {
      expectedPrice: { type: Number, required: true },
      pricePerSqft: { type: Number },
    },

    // 📝 Description
    description: { type: String },

    // 🌟 Amenities
    amenities: [{ type: String }],

    // 🧭 Property Facing
    propertyFacing: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
      ],
    },

    // 🪵 Flooring Type
    flooringType: {
      type: String,
      enum: [
        "Marble",
        "Vitrified Tiles",
        "Wooden",
        "Granite",
        "Ceramic Tiles",
        "Other",
      ],
    },

    // 🚗 Road Width
    facingRoadWidth: { type: Number },

    // 📍 Location Advantages
    locationAdvantages: [{ type: String }],

    // 👤 Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model(
  "CommercialProperty",
  CommercialPropertySchema
);

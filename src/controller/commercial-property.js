import CommercialProperty from "../mongoDb/models/commercial-property.js";

// ✅ Create a new commercial property
export const createCommercialProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    propertyData.createdBy = req.user?._id || null;

    const newProperty = await CommercialProperty.create(propertyData);

    res.status(201).json({
      success: true,
      message: "Commercial property created successfully",
      data: newProperty,
    });
  } catch (error) {
    console.error("Error creating commercial property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create commercial property",
      error: error.message,
    });
  }
};

// ✅ Fetch all commercial properties
export const getAllCommercialProperties = async (req, res) => {
  try {
    const properties = await CommercialProperty.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching commercial properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch commercial properties",
      error: error.message,
    });
  }
};

// ✅ Fetch single commercial property by ID
export const getCommercialPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await CommercialProperty.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Commercial property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching commercial property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch commercial property",
      error: error.message,
    });
  }
};

// ✅ Update commercial property by ID
export const updateCommercialProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProperty = await CommercialProperty.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Commercial property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commercial property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating commercial property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update commercial property",
      error: error.message,
    });
  }
};

export const deleteCommercialProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CommercialProperty.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Commercial property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commercial property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting commercial property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete commercial property",
      error: error.message,
    });
  }
};

import Query from "../mongoDb/models/query-model.js";


export const getQueryCount = async (req, res) => {
  try {
    const count = await Query.countDocuments();
    res.status(200).json({ totalQueries: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Add a new query
export const createQuery = async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;

    if (!name || !email || !phone || !query) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newQuery = await Query.create({
      name,
      email,
      phone,
      query,
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully.",
      query: newQuery,
    });
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Fetch all queries
export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, queries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Fetch a single query by ID
export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }
    res.status(200).json({ success: true, query });
  } catch (error) {
    console.error("Error fetching query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Update a query (e.g., mark as addressed or edit content)
export const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuery = await Query.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuery) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }

    res.status(200).json({
      success: true,
      message: "Query updated successfully.",
      query: updatedQuery,
    });
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete a query
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuery = await Query.findByIdAndDelete(id);

    if (!deletedQuery) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }

    res.status(200).json({
      success: true,
      message: "Query deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

import Career from "../mongoDb/models/jobs-model.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Career.find()
      .populate("postedBy", "fullName email role") 
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      position,
      location,
      type,
      experienceRequired,
      roleType,
    } = req.body;

    if (
      !jobTitle ||
      !position ||
      !location ||
      !type ||
      !experienceRequired ||
      !roleType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Career.create({
      jobTitle,
      position,
      location,
      type,
      experienceRequired,
      roleType,
      postedBy: req.user._id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Career.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updates = req.body;

    const updatedJob = await Career.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Career.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

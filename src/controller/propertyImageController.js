import { s3 } from "../config/aws.js";

export const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const fileName = `${Date.now()}-${file.originalname}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_PROPERTY,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      uploadedUrls.push(uploadResult.Location);
    }

    res.status(200).json({ success: true, urls: uploadedUrls });

  } catch (error) {
    console.error("Property image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message
    });
  }
};

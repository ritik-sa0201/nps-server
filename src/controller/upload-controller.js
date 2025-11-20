import { s3 } from "../config/aws.js";

export const uploadImagesToS3 = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedUrls = [];

    for (const file of files) {
      const fileName = Date.now() + "-" + file.originalname;

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      const uploadResult = await s3.upload(params).promise();
      uploadedUrls.push(uploadResult.Location);
    }

    res.json({ urls: uploadedUrls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "S3 upload failed", error: err });
  }
};

export const getAllS3Images = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET,
    };
    console.log(process.env.AWS_ACCESS);
console.log(process.env.AWS_SECRET);


    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents.map((item) => ({
      key: item.Key,
      name: item.Key.split(".")[0],
      slug: item.Key.replace(/[\s_-]+/g, "").toLowerCase(),
      url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    }));

    res.json(files);
  } catch (error) {
    console.error("S3 list error:", error);
    res.status(500).json({ message: "Failed to fetch files", error });
  }
};


export const getMapBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const params = {
      Bucket: process.env.AWS_BUCKET,
    };

    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents.map((item) => {
      const fileName = item.Key.split(".")[0];
      return {
        key: item.Key,
        name: fileName.replace(/[-_]/g, " "),
        slug: fileName.replace(/[\s_-]+/g, "").toLowerCase(),
        url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      };
    });

    const found = files.find((file) => file.slug === slug);

    if (!found) {
      return res.status(404).json({ message: "Map not found" });
    }

    res.json(found);
  } catch (error) {
    console.error("Error finding map:", error);
    res.status(500).json({ message: "Error fetching map", error });
  }
};


export const uploadYamunaMaps = async (req, res) => {
  try {
    const files = req.files;
    const uploadedUrls = [];

    for (const file of files) {
      const fileName = Date.now() + "-" + file.originalname;

      const params = {
        Bucket: process.env.AWS_BUCKET_YAMUNA,
        Key: fileName,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      uploadedUrls.push(uploadResult.Location);
    }

    res.json({ urls: uploadedUrls });
  } catch (err) {
    res.status(500).json({ message: "Yamuna upload failed", error: err });
  }
};


export const getAllYamunaMaps = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_YAMUNA,
    };

    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents.map((item) => {
      const fileName = item.Key.split(".")[0];
      return {
        key: item.Key,
        name: fileName.replace(/[-_]/g, " "),
        slug: fileName.replace(/[\s_-]+/g, "").toLowerCase(),
        url: `https://${process.env.AWS_BUCKET_YAMUNA}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      };
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Yamuna maps", error: err });
  }
};


export const getYamunaMapBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const params = {
      Bucket: process.env.AWS_BUCKET_YAMUNA,
    };

    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents.map((item) => {
      const fileName = item.Key.split(".")[0];
      return {
        key: item.Key,
        name: fileName.replace(/[-_]/g, " "),
        slug: fileName.replace(/[\s_-]+/g, "").toLowerCase(),
        url: `https://${process.env.AWS_BUCKET_YAMUNA}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      };
    });

    const found = files.find((file) => file.slug === slug);

    if (!found) return res.status(404).json({ message: "Map not found" });

    res.json(found);
  } catch (err) {
    res.status(500).json({ message: "Error fetching map", error: err });
  }
};

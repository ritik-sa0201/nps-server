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
    const {
      limit = 30,
      continuationToken = null,
      search = "",
    } = req.query;

    const params = {
      Bucket: process.env.AWS_BUCKET,
      MaxKeys: Number(limit),
    };

    if (continuationToken) {
      params.ContinuationToken = continuationToken;
    }

    const data = await s3.listObjectsV2(params).promise();

    const files = (data.Contents || [])
      // 🔎 Search filter
      .filter((item) =>
        item.Key.toLowerCase().includes(search.toLowerCase())
      )
      // 🚫 Ignore thumbnail files in main listing
      .filter((item) => !item.Key.includes("_thumb"))
      .map((item) => {
        const name = item.Key.replace(/\.[^/.]+$/, "");

        return {
          key: item.Key,
          name,
          slug: name.replace(/[\s_-]+/g, "").toLowerCase(),

          // ✅ FULL IMAGE (for detail page)
          url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,

          // ✅ THUMBNAIL IMAGE (for gallery)
          thumbUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${name}_thumb.webp`,
        };
      });

    res.json({
      files,
      nextToken: data.IsTruncated ? data.NextContinuationToken : null,
    });
  } catch (error) {
    console.error("S3 list error:", error);
    res.status(500).json({
      message: "Failed to fetch files",
    });
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
    const {
      limit = 30,
      continuationToken = null,
      search = "",
    } = req.query;

    const params = {
      Bucket: process.env.AWS_BUCKET_YAMUNA,
      MaxKeys: Number(limit),
    };

    // 🔁 S3 pagination
    if (continuationToken) {
      params.ContinuationToken = continuationToken;
    }

    const data = await s3.listObjectsV2(params).promise();

    const files = (data.Contents || [])
      // 🔎 search filter
      .filter((item) =>
        item.Key.toLowerCase().includes(search.toLowerCase())
      )
      // 🚫 ignore thumbnail files in listing
      .filter((item) => !item.Key.includes("_thumb"))
      .map((item) => {
        const fileName = item.Key.replace(/\.[^/.]+$/, "");

        return {
          key: item.Key,
          name: fileName.replace(/[-_]/g, " "),
          slug: fileName.replace(/[\s_-]+/g, "").toLowerCase(),

          // ✅ FULL IMAGE (detail page)
          url: `https://${process.env.AWS_BUCKET_YAMUNA}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,

          // ✅ THUMBNAIL IMAGE (gallery)
          thumbUrl: `https://${process.env.AWS_BUCKET_YAMUNA}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}_thumb.webp`,
        };
      });

    res.json({
      files,
      nextToken: data.IsTruncated ? data.NextContinuationToken : null,
    });
  } catch (err) {
    console.error("Yamuna S3 error:", err);
    res.status(500).json({
      message: "Failed to fetch Yamuna maps",
    });
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

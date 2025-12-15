import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import careerRoutes from "./src/routes/careerRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import queryRoutes from "./src/routes/queryRoutes.js";
import residentialRoutes from "./src/routes/residentialRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js"; 
import { connectDB } from "./src/mongoDb/connection/db.js";
import propertyUploadRoutes from "./src/routes/propertyImageRoutes.js"
import commercialPropertyRoutes from "./src/routes/commercialRoutes.js";
dotenv.config();

const app = express();


app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://noidapropertysolution.com",
      "http://localhost:8080"
    ],
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/residential", residentialRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api", propertyUploadRoutes);


app.use("/api/commercial", commercialPropertyRoutes);
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;

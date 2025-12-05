import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
// Configure CORS for frontend access (assuming frontend runs on 3000 or similar)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.PRODUCTION_FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LumiRead Backend Running...");
});

// Primary Routes
app.use("/api/user", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/community", communityRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

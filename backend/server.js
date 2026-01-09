import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";
import { registerUser, authUser } from "./controllers/userController.js";
import bookshelfRoutes from "./routes/bookshelfRoutes.js";
import bookclubRoutes from "./routes/bookclubRoutes.js";
import clubpostRoutes from "./routes/clubpostRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
dotenv.config();
connectDB();

const app = express();
// Configure CORS for frontend access (assuming frontend runs on 3000 or similar)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:5173",
          ]
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
app.use("/api/bookshelf", bookshelfRoutes);
app.use("/api/bookclub", bookclubRoutes);
app.use("/api/clubpost", clubpostRoutes);
app.use("/reviews", reviewRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Legacy support for stale frontends
app.post("/register", registerUser);
app.post("/login", authUser);

import {
  searchBooks,
  checkBook,
  addBook,
  getBook,
  addReview,
} from "./controllers/bookController.js";
app.post("/search", searchBooks);
app.post("/checkbook", checkBook);
app.post("/addbook", addBook);
app.post("/getbook", getBook);
app.post("/addreview", protect, addReview);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

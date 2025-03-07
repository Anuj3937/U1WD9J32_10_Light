const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const userRoutes = require("./routes/userRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const therapistRoutes = require("./routes/therapistRoutes.js");
const allowedOrigins = require("./config/allowedOrigins.js");
const credentials = require("./middleware/credentials.js");

const corsConfig = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,PUT,POST",
  credentials: true, // Allow credentials like HTTP-only cookies
});

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(credentials);
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/therapist", therapistRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

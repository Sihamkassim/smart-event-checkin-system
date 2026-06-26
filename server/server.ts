import express from "express";
// import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.ts";


dotenv.config();

const app = express();

// app.use(cors());
// app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀 (TS)" });
});

// DB test
app.get("/db-test", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ database: "connected ✅" });
  } catch (error: any) {
    res.status(500).json({
      database: "failed ❌",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("MySQL connected 🔥");
  } catch (err: any) {
    console.log("DB Error:", err.message);
  }
});
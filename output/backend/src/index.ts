import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/hello", (_, res) => {
  res.send({ message: "This message comes from serverless backend!!!" });
});

export const getApp = () => {
  return app;
};

// app.listen(50000, async () => {
//   console.log("Start on port 50000")
// })

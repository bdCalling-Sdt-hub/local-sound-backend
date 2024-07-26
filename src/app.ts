import express from "express";
import { streamingMusic } from "./controllers/stream";

const app = express();

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("stream", streamingMusic);

export default app;

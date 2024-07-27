import express, { Request, Response,NextFunction } from "express";
import { streamingMusic } from "./controllers/stream";
import { CustomError } from "./utils/error";

const app = express();

app.use(
  (error: CustomError, _: Request, response: Response, next: NextFunction) => {
    console.error(error);

    if (error.status) {
      response.status(error.status).json({ message: error.message });
    } else {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.get("/", (_: Request, response: Response) => {
  response.send("Local Sound");
});

app.get("/stream", streamingMusic);

export default app;

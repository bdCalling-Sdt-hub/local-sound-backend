import express, { Request, Response, NextFunction } from "express";
import { streamingMusic } from "./controllers/stream";
import { CustomError } from "./utils/error";
import routes from "./routes";
import responseBuilder from "./utils/responseBuilder";

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(
  (error: CustomError, _: Request, response: Response, next: NextFunction) => {
    if (error.status) {
      return response
        .status(error.status)
        .json(responseBuilder(false, error.status, error.message));
    } else {
      return response
        .status(500)
        .json(responseBuilder(false, 500, "Internal Server Error"));
    }
  }
);

app.get("/", (_: Request, response: Response) => {
  response.send("Local Sound");
});

app.get("/stream", streamingMusic);

export default app;

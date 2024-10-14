import { Request, Response } from "express";
import stream from "../utils/live";
import { PassThrough } from "stream";

export default async function streamController(
  _: Request,
  response: Response
) {
  response.setHeader("Content-Type", "audio/mpeg");
  response.setHeader("Transfer-Encoding", "chunked");
  response.setHeader("Connection", "keep-alive");

  const clientStream = new PassThrough();

  stream.pipe(clientStream);
  clientStream.pipe(response);

  response.on("close", () => {
    clientStream.unpipe(response);
    clientStream.destroy();
  });
}

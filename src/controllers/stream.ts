import { Request, Response } from "express";
import stream from "../live";
import { PassThrough } from "stream";

export async function streamingMusic(req: Request, res: Response) {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Connection", "keep-alive");
  
    // Create a new PassThrough stream for the client
    const clientStream = new PassThrough();
  
    // Pipe the main stream to the client's stream
    stream.pipe(clientStream);
  
    // Pipe the client's stream to the response
    clientStream.pipe(res);
  
    // Clean up the client stream on response close
    res.on("close", () => {
      clientStream.unpipe(res);
      clientStream.destroy();
    });
}

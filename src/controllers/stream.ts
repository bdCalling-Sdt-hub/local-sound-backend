import { Request, Response } from "express";
import stream from "../live";
import { PassThrough } from "stream";

export async function streamingMusic(req: Request, res: Response) {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Connection", "keep-alive");
  
    const clientStream = new PassThrough();
    stream.pipe(clientStream);
    clientStream.pipe(res);
    
    res.on("close", () => {
      clientStream.unpipe(res);
      clientStream.destroy();
    });
}

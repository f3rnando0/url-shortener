import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { findShorten } from "../services/url.service";

const shortenSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(10)
    .regex(new RegExp(/^[A-Z0-9]{5,10}$/), "invalid prefix format"),
});

export const catchShortner = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.method === "GET") {
    const urlId = request.url.split("/")[1];
    const isPrefixCorrect = shortenSchema.safeParse({ id: urlId });

    if (!isPrefixCorrect.success)
      return response.status(401).json({
        success: false,
        errors: isPrefixCorrect.error.format(),
        data: {},
      });

    const shorten = await findShorten(isPrefixCorrect.data.id);

    if (shorten) {
      return response.redirect(shorten.originalUrl);
    } else {
      return response.status(404).json({
        success: false,
        errors: { 0: "Shortened URL not found" },
        data: {},
      });
    }
  }

  next();
};

import type { Request, Response } from "express";
import { z } from "zod";
import { createNewShort } from "../services/url.service";
import { env } from "../../env/env";
import { format } from "date-fns";
import { exportMetric } from "../services/metric.service";
import { isToday } from "date-fns";

const createUrlSchema = z.object({
  url: z.string().url().toLowerCase(),
});

export const createUrl = async (request: Request, response: Response) => {
  const isBodyValid = createUrlSchema.safeParse(request.body);

  if (!isBodyValid.success)
    return response.status(400).json({
      success: false,
      errrors: isBodyValid.error.format(),
      data: {},
    });

  if (isBodyValid.data?.url) {
    const url = await createNewShort(isBodyValid.data?.url);

    if (url) {
      response.status(201).json({
        success: true,
        errors: null,
        data: {
          shortUrl: `${env.data.LOCALHOST}/${url.id}`,
          validUntil: `${format(url.expiresAt, "dd/MM/yyyy HH:mm:ss")}`,
        },
      });
    }
  }
};

const getMetricSchema = z.object({
  prefix: z
    .string()
    .min(5)
    .max(10)
    .regex(new RegExp(/^[A-Z0-9]{5,10}$/), "invalid prefix format"),
});

export const getMetric = async (request: Request, response: Response) => {
  const isQueryValid = getMetricSchema.safeParse(request.query);

  if (!isQueryValid.success)
    return response.status(400).json({
      success: false,
      errrors: isQueryValid.error.format(),
      data: {},
    });

  if (isQueryValid.data.prefix) {
    const metrics = await exportMetric(isQueryValid.data.prefix);

    response.status(200).json({
      success: true,
      errors: null,
      data: {
        clicks: metrics?.length,
        clicksToday: metrics?.filter(
          (metric) => metric.createdAt && isToday(metric.createdAt)
        ).length,
        metrics,
      },
    });
  }
};

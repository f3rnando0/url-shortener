import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Metric = {
  shortenId: string;
  ip: string | null;
  userAgent: string | null;
};

export const addMetric = async ({ shortenId, ip, userAgent }: Metric) => {
  const shorten = await prisma.url.findUnique({ where: { id: shortenId } });

  if (shorten) {
    const metric = await prisma.clickMetric.create({
      data: {
        shortenId,
        ip,
        userAgent,
      },
    });

    return metric;
  }
};

export const exportMetric = async (shortenId: string) => {
  const shorten = await prisma.url.findUnique({ where: { id: shortenId } });

  if (shorten) {
    const metrics = await prisma.clickMetric.findMany({
      where: {
        shortenId,
      },
      select: {
        id: true,
        ip: true,
        userAgent: true,
        createdAt: true,
      },
    });

    return metrics;
  }
};

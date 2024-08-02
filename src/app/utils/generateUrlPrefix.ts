import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { add } from "date-fns";

export const generateUrlPrefix = async (
  url: string,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
  for (;;) {
    const prefix = generatePrefix();
    const existingUrlPrefix = await prisma.url.findUnique({
      where: { id: prefix },
    });

    if (existingUrlPrefix) continue;

    const newUrl = await prisma.url.create({
      data: {
        id: prefix,
        originalUrl: url,
        expiresAt: add(Date.now(), {
          days: 7,
        }),
      },
    });

    return newUrl;
  }
};

const generatePrefix = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const prefixLength = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

  let prefix = "";

  for (let i = 0; i < prefixLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    prefix += characters[randomIndex];
  }

  return prefix;
};

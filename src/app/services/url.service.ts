import { PrismaClient } from "@prisma/client";
import { generateUrlPrefix } from "../utils/generateUrlPrefix";
import { isAfter } from "date-fns";

const prisma = new PrismaClient();

export const createNewShort = async (url: string) => {
  const newUrl = await generateUrlPrefix(url, prisma);
  return newUrl;
};

export const findShorten = async (prefix: string) => {
  const shorten = await prisma.url.findUnique({
    where: { id: prefix },
  });

  if (shorten && isAfter(Date.now(), shorten.expiresAt)) {
    await prisma.url.delete({ where: { id: prefix } });
    return null;
  }

  return shorten;
};

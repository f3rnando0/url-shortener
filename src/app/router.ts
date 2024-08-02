import { Router } from "express";
import { createUrl } from "./controllers/url.controller";
import { catchShortner } from "./middlewares/url.middleware";

export const router = Router();

router.use(catchShortner);
router.post("/shorten-url", createUrl);

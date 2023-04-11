import express from "express";
import { Request, Response, NextFunction } from "express";
import CrawlerController from "../app/Http/Controllers/CrawlerController";

const router = express.Router();

// IndexController
const crawlerController = new CrawlerController();

router.get(
    `/crawler/domainurls`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.fetchDomainLinks(request, response, next);
    }
);

router.post(
    `/crawler/url`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.storeLinks(request, response, next);
    }
);


export default router;

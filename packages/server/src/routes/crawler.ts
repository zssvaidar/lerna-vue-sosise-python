import express from "express";
import { Request, Response, NextFunction } from "express";
import CrawlerController from "../app/Http/Controllers/CrawlerController";

const router = express.Router();

// IndexController
const crawlerController = new CrawlerController();

router.post(
    `/domainurls`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.createDomainUrl(request, response, next);
    }
);

router.delete(
    `/domainurls`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.deleteDomainUrl(request, response, next);
    }
);

router.get(
    `/domainurls/:id`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.fetchDomainUrl(request, response, next);
    }
);

router.get(
    `/domainurls`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.fetchDomainUrls(request, response, next);
    }
);

router.get(
    `/crawler/runscript`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.runscriptCrawler(request, response, next);
    }
);

router.post(
    `/domainurls/url`,
    (request: Request, response: Response, next: NextFunction) => {
        crawlerController.storeLinks(request, response, next);
    }
);


export default router;

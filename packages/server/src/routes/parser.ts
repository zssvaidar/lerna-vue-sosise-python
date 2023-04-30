import express from "express";
import { Request, Response, NextFunction } from "express";
import CrawlerController from "../app/Http/Controllers/CrawlerController";
import InfoParserController from "../app/Http/Controllers/InfoParserController";

const router = express.Router();

// IndexController
const infoParserController = new InfoParserController();


router.get(
    `/parser/domains`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.serveUrls(request, response, next);
    }
);

router.get(
    `/parser/domain/:id/urls`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.serveDomainUrls(request, response, next);
    }
);

router.post(
    `/parser/domain/:id/urlGroups`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.createDomainUrlGroups(request, response, next);
    }
);

router.get(
    `/parser/domain/:id/urlGroups`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.serveDomainUrlGroups(request, response, next);
    }
);

router.post(
    `/parser/domain/:id/urlGroups/:groupId/urlGroupTags`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.saveDomainUrlGroupTags(request, response, next);
    }
);

router.get(
    `/parser/domain/:id/urlGroupHtmlContent/collect`,
    (request: Request, response: Response, next: NextFunction) => {
        infoParserController.starCollectUrlGroupHtmlContent(request, response, next);
    }
);

export default router;

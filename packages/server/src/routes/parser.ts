import express from "express";
import { Request, Response, NextFunction } from "express";
import CrawlerController from "../app/Http/Controllers/CrawlerController";
import InfoParserController from "../app/Http/Controllers/InfoParserController";
import SiteInfoController from "../app/Http/Controllers/SiteInfoController";

const router = express.Router();

// IndexController
const infoParserController = new InfoParserController();
const siteInfoController = new SiteInfoController();


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


router.get(
    `/parser/domain/:id`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.serveDomainData(request, response, next);
    }
);


router.get(
    `/parser/domain/:id/group/:group_id`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.serveDomainUrlGroupData(request, response, next);
    }
);

router.put(
    `/parser/domain/:id/group/:group_id`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.setDomainUrlGroupTags(request, response, next);
    }
);

router.put(
    `/parser/domain/:id/group/:group_id/ready`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.setDomainUrlGroupReady(request, response, next);
    }
);

router.get(
    `/parser/domain/:id/group/:group_id/collectedData`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.serveGroupCollectedData(request, response, next);
    }
);

router.get(
    `/parser/domain/:id/urlGroups/:group_id/pageTags`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.serveGroupPagesAndGroupTagData(request, response, next);
    }
);

router.post(
    `/parser/domain/:id/urlGroups/:group_id/page/:page_id/pageTags`,
    (request: Request, response: Response, next: NextFunction) => {
        siteInfoController.savePageTagData(request, response, next);
    }
);

export default router;

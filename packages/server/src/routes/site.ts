
import express from "express";
import { Request, Response, NextFunction } from "express";
import SiteFilterController from "../app/Http/Controllers/SiteFilterController";
const router = express.Router();

const controller = new SiteFilterController();

router.get(
    `/site/filterInfo`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.fetchFilters(request, response, next);
    }
);

router.get(
    `/site/group/:group_id/tagDataCalculate/runscript`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.runscriptCalculateGroupPageTagData(request, response, next);
    }
);

router.put(
    `/site/pageTag/:pageDataTagId`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.updatePageTagData(request, response, next);
    }
);

router.get(
    `/site/searchByText`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.getTagDataSearch(request, response, next);
    }
);

router.get(
    `/site/searchDataByText`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.getTagData(request, response, next);
    }
);

router.get(
    `/site/searchDataByTagType`,
    (request: Request, response: Response, next: NextFunction) => {
        controller.getTagData(request, response, next);
    }
);

export default router;
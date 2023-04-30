export default interface PageGroupUrl {
    id: number;
    domainId: number;
    pageId: number;
    split: number;
    url: string;
    pageIds: number[];
    groupUrl: string;
    count: number;
}

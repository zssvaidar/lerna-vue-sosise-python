export default interface UrlGroupTagType {
    tagId: number;
    parentId: number;
    urlId: number;
    depth: number;
    tag: string;
    text: string;
    xpath: string;
    selectTag: boolean;
    selectChildTags: boolean;
}

export default interface ScenarioType {
    id: number;
    label: string;
    code: string;
    parentId: number;
    step: number;
    lang: string;
    response: string;
    comment: string;
    token: string;
    tokens: string[];
    fileId: number;

    icon: string;
    key: string;
    langId: number;

    removedTokens: string[];
    newTokens: string[];
}

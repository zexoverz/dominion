export interface GeneralInfo {
    id: string;
    name: string;
    title: string;
    emoji: string;
    role: string;
    domain: string[];
    model: string;
    priority: number;
}
export declare const GENERALS: GeneralInfo[];
export declare const GENERALS_MAP: {
    [k: string]: GeneralInfo;
};

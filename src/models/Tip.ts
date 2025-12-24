export interface TipSection {
    title: string;
    content: string;
    category?: string;
}

export interface EloTip {
    id: string;
    title: string;
    sections: TipSection[];
}

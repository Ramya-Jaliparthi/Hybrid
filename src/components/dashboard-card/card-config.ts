/*
Class defining the type of card configuration properties.
*/
export interface CardConfig{
    id: string;
    entryPage?: any;
    title: string;
    icon: string;
    height?: string;
    enabled: boolean;
    component: any;
    visibilityState: number;
    hideHeader?: boolean;
}
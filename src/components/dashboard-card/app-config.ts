
/*
Class defining the type of application configuration properties.
*/
export interface AppConfig{
    id: any;
    title: string;
    icon: string;
    visibilityState: number;
    order: number;
    startGroup?: boolean;
    active?:boolean;
    enabled:boolean;
}


/** @see https://docs.logsnag.com/api-reference/identify */
export type UserProperties = Record<string, string | number | boolean>;

export interface LogSnagOptions {
    /** An API token created via LogSnag settings */
    token: string;
    /** A hyphen delimited project name (i.e. my-logsnag-project) */
    project: string;
}

/** @see https://docs.logsnag.com/api-reference/log */
export interface EventOptions {
    user_id?: string;
    description?: string;
    icon?: string;
    notify?: boolean;
    tags?: Record<string, string | number | boolean>;
    parser?: "markdown" | "text";
    timestamp?: number;
}

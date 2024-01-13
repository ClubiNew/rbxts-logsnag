import type { EventOptions } from "./types";
import { API } from "./api";

export class Channel {
    constructor(
        private readonly api: API,
        private readonly name: string,
    ) {}

    /** @see https://docs.logsnag.com/api-reference/log */
    public log(event: string, options?: EventOptions) {
        return API.checkKebabCase(options?.tags).then(() =>
            this.api.post("log", {
                channel: this.name,
                event,
                ...options,
            }),
        );
    }
}

import type { EventOptions, LogSnagOptions } from "./types";

export class Channel {
    constructor(
        private readonly options: LogSnagOptions,
        private readonly name: string,
    ) {}

    /** @see https://docs.logsnag.com/api-reference/log */
    public log(event: string, options: EventOptions) {}
}

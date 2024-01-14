import type { EventOptions } from "./types";
import { API } from "./api";

/**
 * Represents a LogSnag events channel.
 * @see {@link LogSnag.getChannel}
 */
export class Channel {
    /** @internal */
    constructor(
        private readonly api: API,
        private readonly name: string,
    ) {}

    /**
     * Publishes a new event in the channel.
     * @see https://docs.logsnag.com/api-reference/log
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
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

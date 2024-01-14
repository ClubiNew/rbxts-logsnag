import type { LogSnagOptions, UserProperties } from "./types";
import { Channel } from "./channel";
import { Insight } from "./insight";
import { API } from "./api";

/** Wrapper around the LogSnag API for a given project and API token. */
export class LogSnag {
    private readonly api: API;

    constructor(options: LogSnagOptions) {
        this.api = new API(options.token, options.project);
    }

    /** @returns A {@link Channel} with the given name. */
    public getChannel(name: string): Channel {
        return new Channel(this.api, name);
    }

    /** @returns An {@link Insight} with the given name. */
    public getInsight(title: string): Insight {
        return new Insight(this.api, title);
    }

    /**
     * Sets properties for the given user.
     * @see https://docs.logsnag.com/api-reference/identify
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
    public identify(userId: string, properties: UserProperties) {
        return API.checkKebabCase(properties).then(() =>
            this.api.post("identify", {
                user_id: userId,
                properties,
            }),
        );
    }
}

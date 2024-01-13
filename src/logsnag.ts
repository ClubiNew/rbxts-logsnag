import type { LogSnagOptions, UserProperties } from "./types";
import { Channel } from "./channel";
import { Insight } from "./insight";
import { API } from "./api";

export class LogSnag {
    private readonly api: API;

    constructor(options: LogSnagOptions) {
        this.api = new API(options.token, options.project);
    }

    public getChannel(name: string): Channel {
        return new Channel(this.api, name);
    }

    public getInsight(name: string): Insight {
        return new Insight(this.api, name);
    }

    /** @see https://docs.logsnag.com/api-reference/identify */
    public identify(userId: string, properties: UserProperties) {
        return this.api.post("identify", {
            user_id: userId,
            properties,
        });
    }
}

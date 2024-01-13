import type { LogSnagOptions, UserProperties } from "./types";
import { Channel } from "./channel";
import { Insight } from "./insight";

export class LogSnag {
    constructor(private readonly options: LogSnagOptions) {}

    public getChannel(name: string): Channel {
        return new Channel(this.options, name);
    }

    public getInsight(name: string): Insight {
        return new Insight(this.options, name);
    }

    /** @see https://docs.logsnag.com/api-reference/identify */
    public identify(userId: string, properties: UserProperties) {}
}

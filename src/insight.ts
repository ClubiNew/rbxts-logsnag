import { API } from "./api";

export class Insight {
    constructor(
        private readonly api: API,
        private readonly name: string,
        private readonly defaultEmoji?: string,
    ) {}

    /** @see https://docs.logsnag.com/api-reference/insight */
    public set(value: string | number, emoji = this.defaultEmoji) {}

    /** @see https://docs.logsnag.com/api-reference/insight-mutate */
    public increment(amount: number, emoji = this.defaultEmoji) {}
}

import type { API } from "./api";

/**
 * Represents a LogSnag insight.
 * @see {@link LogSnag.getInsight}
 */
export class Insight {
    /** @internal */
    constructor(
        private readonly api: API,
        private readonly name: string,
        private readonly defaultEmoji?: string,
    ) {}

    /**
     * Sets a new value for the insight.
     * @see https://docs.logsnag.com/api-reference/insight
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
    public set(value: string | number, emoji?: string) {
        return this.api.post("insight", {
            title: this.name,
            emoji: emoji ?? this.defaultEmoji,
            value,
        });
    }

    /**
     * Mutates the current value of the insight with the given increment or decrement.
     * @see https://docs.logsnag.com/api-reference/insight-mutate
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
    public increment(amount: number, emoji?: string) {
        return this.api.patch("insight", {
            title: this.name,
            emoji: emoji ?? this.defaultEmoji,
            value: { $inc: amount },
        });
    }
}

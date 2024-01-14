import type { API } from "./api";

/**
 * Represents a LogSnag insight.
 * @see {@link LogSnag.getInsight}
 */
export class Insight {
    /** @internal */
    constructor(
        private readonly api: API,
        private readonly title: string,
        private readonly defaultIcon?: string,
    ) {}

    /** @returns The title of the insight. */
    public getTitle() {
        return this.title;
    }

    /**
     * Sets a new value for the insight.
     * @see https://docs.logsnag.com/api-reference/insight
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
    public set(value: string | number, icon?: string) {
        return this.api.post("insight", {
            title: this.title,
            icon: icon ?? this.defaultIcon,
            value,
        });
    }

    /**
     * Mutates the current value of the insight with the given increment or decrement.
     * @see https://docs.logsnag.com/api-reference/insight-mutate
     * @returns A promise that resolves if the request succeeds, or rejects with an error message.
     */
    public increment(amount: number, icon?: string) {
        return this.api.patch("insight", {
            title: this.title,
            icon: icon ?? this.defaultIcon,
            value: { $inc: amount },
        });
    }
}

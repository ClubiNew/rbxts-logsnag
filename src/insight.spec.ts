/// <reference types="@rbxts/testez/globals" />

import { LogSnag } from "./logsnag";

export = () => {
    describe("set", () => {
        it("should resolve valid requests", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez", ":bug:");
            const [status, message] = insight.set(10).awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should reject invalid emoji", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez", "invalid emoji");
            const [status, message] = insight.set(10).awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Icon must be a single valid emoji");
            expect(reason.size()).to.never.equal(0);
        });
    });

    describe("increment", () => {
        it("should allow positive amounts", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez");
            const [status, message] = insight.increment(3, "👆").awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should allow zero amounts", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez");
            const [status, message] = insight.increment(0, "✊").awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should allow negative amounts", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez");
            const [status, message] = insight.increment(-1, "👇").awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should reject invalid emoji", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("testez");
            const [status, message] = insight.increment(0, "invalid emoji").awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Icon must be a single valid emoji");
            expect(reason.size()).to.never.equal(0);
        });
    });
};

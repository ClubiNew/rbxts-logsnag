/// <reference types="@rbxts/testez/globals" />

import { LogSnag } from "./logsnag";

export = () => {
    describe("log", () => {
        it("should resolve valid requests", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const channel = logsnag.getChannel("test");

            const [status, message] = channel
                .log("test", {
                    user_id: "user",
                    icon: "🐛",
                    tags: { testez: true },
                    description: "should resolve valid requests",
                })
                .awaitStatus();

            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should reject invalid channel names", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const channel = logsnag.getChannel("invalid name");
            const [status, message] = channel.log("test").awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Channel name must be a string of ");
            expect(reason.size()).to.never.equal(0);
        });

        it("should reject invalid emoji", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const channel = logsnag.getChannel("test");
            const [status, message] = channel.log("test", { icon: "invalid emoji" }).awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Icon must be a single valid emoji");
            expect(reason.size()).to.never.equal(0);
        });
    });
};

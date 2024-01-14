/// <reference types="@rbxts/testez/globals" />

import { LogSnag } from "./logsnag";
import { Channel } from "./channel";
import { Insight } from "./insight";

export = () => {
    describe("getChannel", () => {
        it("should create a channel", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const channel = logsnag.getChannel("test");
            expect(channel).to.be.ok();
            expect(getmetatable(channel)).to.equal(Channel);
            expect(channel.getName()).to.equal("test");
        });
    });

    describe("getInsight", () => {
        it("should create an insight", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const insight = logsnag.getInsight("test", "🐛");
            expect(insight).to.be.ok();
            expect(getmetatable(insight)).to.equal(Insight);
            expect(insight.getTitle()).to.equal("test");
        });
    });

    describe("identify", () => {
        it("should resolve valid requests", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const [status, message] = logsnag
                .identify("user", { membership: "Premium", "last-seen": DateTime.now().ToIsoDate() })
                .awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
            expect(message).to.never.be.ok();
        });

        it("should reject invalid property names", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const [status, message] = logsnag.identify("user", { "membership status": "Premium" }).awaitStatus();
            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.equal('All tag and property keys must be in kebab-case, got "membership status"');
        });

        it("should reject invalid property values", (context) => {
            const logsnag = context.get("logsnag") as LogSnag;
            const [status, message] = logsnag
                .identify("user", { membership: { kind: "Premium", active: true } as unknown as string })
                .awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Property values must be ");
            expect(reason.size()).to.never.equal(0);
        });
    });
};

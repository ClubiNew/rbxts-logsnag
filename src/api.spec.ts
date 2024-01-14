/// <reference types="@rbxts/testez/globals" />

import { API } from "./api";

export = () => {
    describe("checkKebabCase", () => {
        it("should resolve if all keys are in kebab-case", () => {
            const [status] = API.checkKebabCase({ "tag-name": "value" }).awaitStatus();
            expect(status).to.equal(Promise.Status.Resolved);
        });

        it("should reject if any keys are not in kebab-case", () => {
            const badKeys = ["tag-2", "tag--b", "-tag", "tag-", "tag b", "tag_b", "🏷️-b", "TAG-b"];
            for (const key of badKeys) {
                const [status, message] = API.checkKebabCase({
                    "tag-a": "value",
                    [key]: "value",
                }).awaitStatus();

                expect(status).to.equal(Promise.Status.Rejected);
                expect(message).to.equal(`All tag and property keys must be in kebab-case, got "${key}"`);
            }
        });
    });

    describe("request", () => {
        it("should reject invalid endpoints", (context) => {
            const api = context.get("api") as API;
            const [status, message] = api.request("POST", "invalid", {}).awaitStatus();
            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.equal("HTTP Error 404: Not Found");
        });

        it("should reject unauthorized requests", (context) => {
            const api = new API("", "test");
            const [status, message] = api.request("POST", "log", {}).awaitStatus();

            expect(status).to.equal(Promise.Status.Rejected);
            expect(message).to.be.a("string");

            const reason = (message as string).find("Authorization header must be a valid Bearer token");
            expect(reason.size()).to.never.equal(0);
        });
    });
};

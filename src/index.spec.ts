/// <reference types="@rbxts/testez/globals" />

import { $env } from "rbxts-transform-env";
import { LogSnag } from "./logsnag";
import { API } from "./api";

export = () => {
    beforeAll((context) => {
        const token = $env.string("LOGSNAG_TOKEN") as string;
        context.set("token", token);
        context.set("api", new API(token, "test"));
        context.set("logsnag", new LogSnag({ project: "test", token: token }));
    });
};

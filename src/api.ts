import { HttpService } from "@rbxts/services";

type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
interface Response {
    message?: string;
    validation?: {
        headers?: { message: string }[];
        body?: { message: string }[];
    };
}

/** @internal */
export class API {
    constructor(
        private readonly token: string,
        private readonly project: string,
    ) {}

    /**
     * Ensures all keys in the record are in kebab-case.
     * @returns A promise that resolves if all keys are in kebab-case, or rejects with an error message.
     */
    public static checkKebabCase(record: Record<string, unknown> = {}): Promise<unknown> {
        for (const [key] of pairs(record)) {
            if (!string.split(key, "-").every((part) => string.match(part, "^%l+$") !== undefined)) {
                return Promise.reject(`All tag and property keys must be in kebab-case, got "${key}"`);
            }
        }
        return Promise.resolve();
    }

    public post(endpoint: string, body: object) {
        return this.request("POST", endpoint, body);
    }

    public patch(endpoint: string, body: object) {
        return this.request("PATCH", endpoint, body);
    }

    private request(method: Method, endpoint: string, requestBody: object): Promise<void> {
        // attempt to encode and send the request
        return Promise.try(() => {
            const requestJson = HttpService.JSONEncode({
                project: this.project,
                ...requestBody,
            });

            return HttpService.RequestAsync({
                Url: `https://api.logsnag.com/${endpoint}`,
                Method: method,
                Body: requestJson,
                Headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            });
        }).then((response) => {
            if (!response.Success) {
                return Promise.reject(`HTTP Error ${response.StatusCode}: ${response.StatusMessage}`);
            }

            // parse the response
            return Promise.try(() => {
                return HttpService.JSONDecode(response.Body) as Response;
            }).then((responseBody) => {
                // all responses are status 200, so we need to check for an error message manually
                if (responseBody.message === undefined) {
                    return Promise.resolve();
                } else if (responseBody.message !== "Validation Error") {
                    return Promise.reject(responseBody.message);
                }

                // for validation errors, we can provide a more detailed error message

                const validationErrors = new Array<string>();

                responseBody.validation?.headers?.forEach((header) => {
                    validationErrors.push(header.message);
                });

                responseBody.validation?.body?.forEach((header) => {
                    validationErrors.push(header.message);
                });

                return Promise.reject(
                    `Found ${validationErrors.size()} validation error(s):\n- ${validationErrors.join("\n- ")}`,
                );
            });
        }) as Promise<void>;
    }
}

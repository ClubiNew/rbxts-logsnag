import { HttpService } from "@rbxts/services";

type Method = "POST" | "PUT" | "DELETE" | "PATCH";
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
            if (string.split(key, "-").some((substr) => string.match(substr, "^%l+$").isEmpty())) {
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

    /** @internal */
    public request(method: Method, endpoint: string, requestBody: object): Promise<void> {
        // attempt to encode and send the request
        return Promise.try(() => {
            const requestJson = HttpService.JSONEncode({
                project: this.project,
                ...requestBody,
            });

            return HttpService.RequestAsync({
                Url: `https://api.logsnag.com/v1/${endpoint}`,
                Method: method,
                Body: requestJson,
                Headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            });
        }).then((response) => {
            if (response.Success) {
                return Promise.resolve();
            }

            // parse the error response
            const httpError = `HTTP Error ${response.StatusCode}: ${response.StatusMessage}`;
            return Promise.try(() => {
                return HttpService.JSONDecode(response.Body) as Response;
            }).then(
                (responseBody) => {
                    if (responseBody.message === undefined) {
                        return Promise.reject(httpError);
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
                        `Found ${validationErrors.size()} validation error${validationErrors.size() === 1 ? "" : "s"}:\n\t- ${validationErrors.join("\n\t- ")}`,
                    );
                },
                () => {
                    // if we couldn't decode a body, just return the HTTP error
                    return Promise.reject(httpError);
                },
            );
        }) as Promise<void>;
    }
}

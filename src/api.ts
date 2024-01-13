import { HttpService } from "@rbxts/services";

type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
interface Response {
    message?: string;
    validation?: {
        headers?: { message: string }[];
        body?: { message: string }[];
    };
}

export class API {
    constructor(
        private readonly token: string,
        private readonly project: string,
    ) {}

    public post(endpoint: string, body: object) {
        return this.request("POST", endpoint, body);
    }

    public patch(endpoint: string, body: object) {
        return this.request("PATCH", endpoint, body);
    }

    private request(method: Method, endpoint: string, requestBody: object): Promise<void> {
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

            return Promise.try(() => {
                return HttpService.JSONDecode(response.Body) as Response;
            }).then((responseBody) => {
                if (responseBody.message === undefined) {
                    return Promise.resolve();
                } else if (responseBody.message !== "Validation Error") {
                    return Promise.reject(responseBody.message);
                }

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

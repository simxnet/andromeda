import type { DiscordAPIResponse } from "./types";

const API_BASE_URL = "https://discord.com/api/v10";

const request = async (
	token: string,
	method: string,
	endpoint: string,
	data?: any,
): Promise<DiscordAPIResponse> => {
	const url = `${API_BASE_URL}${endpoint}`;
	const headers = {
		Authorization: `Bot ${token}`,
		"Content-Type": "application/json",
	};

	const response = await fetch(url, {
		method,
		headers,
		body: data ? JSON.stringify(data) : null,
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`err: ${JSON.stringify(errorData)}`);
	}

	return response.json();
};

export const get = (token: string, endpoint: string) =>
	request(token, "GET", endpoint);
export const post = (token: string, endpoint: string, data: any) =>
	request(token, "POST", endpoint, data);
export const patch = (token: string, endpoint: string, data: any) =>
	request(token, "PATCH", endpoint, data);
export const del = (token: string, endpoint: string) =>
	request(token, "DELETE", endpoint);

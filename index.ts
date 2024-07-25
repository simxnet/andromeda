import type { APIMessage } from "discord-api-types/v10";
import { get, post } from "./src/api";
import { connect } from "./src/gateway";

const token = "TOKEN";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const handleEvent = (event: string, data: any) => {
	console.log(`Event received: ${event}`, data);

	switch (event) {
		case "READY":
			console.log("Bot is ready!");
			break;
		case "MESSAGE_CREATE": {
			const message = data as APIMessage;

			if (message.content.startsWith("!test")) {
				post(token, `/channels/${message.channel_id}/messages`, {
					content: "Hello, world!",
				});
			}
			break;
		}
		default:
			break;
	}
};

connect(token, handleEvent);

// Example REST API request
(async () => {
	try {
		const user = await get(token, "/users/@me");
		console.log("Bot user info:", user);
	} catch (error) {
		console.error("Error fetching bot user info:", error);
	}
})();

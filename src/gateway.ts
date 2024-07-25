import WebSocket from "ws";
import type { GatewayPayload, GatewayHello, IdentifyPayload } from "./types";

const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

let sequence: number | null = null;
let heartbeatInterval: number | null = null;

const connect = (
	token: string,
	handleEvent: (event: string, data: any) => void,
) => {
	const ws = new WebSocket(GATEWAY_URL);

	ws.on("open", () => {
		console.log("Connected to Discord Gateway");
	});

	ws.on("message", (data) => {
		const payload: GatewayPayload = JSON.parse(data.toString());
		handlePayload(ws, payload, token, handleEvent);
	});

	ws.on("close", (code, reason) => {
		console.log(`Disconnected: ${code} - ${reason}`);
		// Handle reconnection logic here
	});

	ws.on("error", (error) => {
		console.error("WebSocket error:", error);
	});

	return ws;
};

const handlePayload = (
	ws: WebSocket,
	payload: GatewayPayload,
	token: string,
	handleEvent: (event: string, data: any) => void,
) => {
	const { t: event, s, op, d } = payload;

	if (s) sequence = s;

	switch (op) {
		case 10: {
			// Hello
			const helloData = d as GatewayHello["d"];
			heartbeatInterval = helloData.heartbeat_interval;
			identify(ws, token);
			startHeartbeat(ws);
			break;
		}
		case 11: // Heartbeat ACK
			console.log(process.memoryUsage().rss / 1024 / 1024);
			console.log("Heartbeat acknowledged");
			break;
		case 0: // Dispatch event
			handleEvent(event!, d);
			break;
		default:
			console.log("Unhandled payload:", payload);
	}
};

const identify = (ws: WebSocket, token: string) => {
	const identifyPayload: IdentifyPayload = {
		op: 2,
		d: {
			token,
			intents: 33280, // Example intents
			properties: {
				$os: "win32",
				$browser: "andromeda",
				$device: "andromeda",
			},
		},
	};

	ws.send(JSON.stringify(identifyPayload));
};

const startHeartbeat = (ws: WebSocket) => {
	setInterval(() => {
		ws.send(JSON.stringify({ op: 1, d: sequence }));
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
	}, heartbeatInterval!);
};

export { connect };

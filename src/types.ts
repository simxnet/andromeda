export type DiscordAPIResponse = {};

export interface GatewayPayload {
	op: number;
	d?: any;
	s?: number;
	t?: string;
}

export interface GatewayHello extends GatewayPayload {
	d: {
		heartbeat_interval: number;
	};
}

export interface IdentifyPayload {
	op: number;
	d: {
		token: string;
		intents: number;
		properties: {
			$os: string;
			$browser: string;
			$device: string;
		};
	};
}

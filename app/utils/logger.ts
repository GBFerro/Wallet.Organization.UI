/**
 * Logger utility for development and production environments
 * In production, logs are disabled by default
 */

const isDevelopment = __DEV__;

export const logger = {
	log: (...args: unknown[]) => {
		if (isDevelopment) {
			console.log(...args);
		}
	},

	error: (...args: unknown[]) => {
		if (isDevelopment) {
			console.error(...args);
		}
	},

	warn: (...args: unknown[]) => {
		if (isDevelopment) {
			console.warn(...args);
		}
	},

	info: (...args: unknown[]) => {
		if (isDevelopment) {
			console.info(...args);
		}
	},

	debug: (...args: unknown[]) => {
		if (isDevelopment) {
			console.debug(...args);
		}
	},
};

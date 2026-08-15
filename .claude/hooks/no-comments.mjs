import { readFileSync } from "node:fs";

const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const COMMENT = /^\s*(\/\/|\/\*)/;
const DIRECTIVE = /@ts-ignore|@ts-expect-error|biome-ignore/;
const MAX_REPORTED = 5;

function read() {
	try {
		return JSON.parse(readFileSync(0, "utf8"));
	} catch {
		return null;
	}
}

const payload = read();
if (!payload) process.exit(0);

const file = payload.tool_response?.filePath ?? payload.tool_input?.file_path;
if (!file || !SOURCE.test(file)) process.exit(0);

let contents;
try {
	contents = readFileSync(file, "utf8");
} catch {
	process.exit(0);
}

const offenders = contents
	.split("\n")
	.map((line, index) => ({ line: index + 1, text: line }))
	.filter(({ text }) => COMMENT.test(text) && !DIRECTIVE.test(text));

if (offenders.length === 0) process.exit(0);

const listed = offenders
	.slice(0, MAX_REPORTED)
	.map(({ line, text }) => `  ${line}: ${text.trim()}`)
	.join("\n");

const extra =
	offenders.length > MAX_REPORTED
		? `\n  ... e mais ${offenders.length - MAX_REPORTED}`
		: "";

process.stdout.write(
	JSON.stringify({
		decision: "block",
		reason: `Este projeto nao permite comentarios em codigo. Remova de ${file}:\n${listed}${extra}\n\nSe a informacao for necessaria, torne-a desnecessaria com um nome melhor, uma funcao extraida ou um tipo. Diretivas (@ts-ignore, biome-ignore) sao permitidas.`,
	}),
);

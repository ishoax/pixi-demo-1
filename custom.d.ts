// Allows TS to recognize require["context"]
declare var require: {
	context(
		directory: string,
		useSubdirectories: boolean,
		regExp: RegExp,
	): {
		keys(): string[];
		<T>(id: string): T;
	};
};
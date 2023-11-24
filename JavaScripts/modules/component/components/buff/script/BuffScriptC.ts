export enum BuffScriptCName {
	applyBuffToSelf = "applyBuffToSelf",
	applyBuffToTarget = "applyBuffToTarget",
}
export class BuffScriptC {
	applyBuffToSelf(a: number, b: number): void {
		console.log("applyBuffToSelf--------->", a, b);
	}
	applyBuffToTarget(a: number, b: number, c: string) {
		console.log("applyBuffToTarget--------->", a, b, c);
	}
}

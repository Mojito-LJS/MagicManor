interface IScript {
	onStart(): void;
	onUpdate(DeltaTime: number): void;
	onDestroy(): void;
}
export class Script<T extends mw.Script> implements IScript {
	protected parent: T;
	constructor(parent: T) {
		this.parent = parent;
	}
	onStart(): void { }
	onUpdate(DeltaTime: number): void { }
	onDestroy(): void { }
}
export default class BaseScript<C extends Script<mw.Script>, S extends Script<mw.Script>> extends mw.Script {
	protected client: C;
	protected server: S;

	constructor(private clientCls: mw.TypeName<C>, private serverCls: mw.TypeName<S>, data: mw.ActorInfo) {
		super(data);
	}

	protected onStart(): void {
		if (SystemUtil.isClient()) {
			this.client = new this.clientCls(this);
			this.client.onStart();
		}
		if (SystemUtil.isServer()) {
			this.server = new this.serverCls(this);
			this.server.onStart();
		}
	}

	protected onUpdate(DeltaTime: number): void {
		if (SystemUtil.isClient()) {
			this.client.onUpdate(DeltaTime);
		}
		if (SystemUtil.isServer()) {
			this.server.onUpdate(DeltaTime);
		}
	}

	protected onDestroy(): void {
		if (SystemUtil.isClient()) {
			this.client.onDestroy();
		}
		if (SystemUtil.isServer()) {
			this.server.onDestroy();
		}
	}
}
const scriptMap: Map<string, mw.TypeName<mw.Script>> = new Map();
export function registerFightScript<T extends mw.Script>(constructor: mw.TypeName<T>) {
	scriptMap.set(constructor.name, constructor);
}
export function initScript(fun: (script: mw.Script) => void) {
	if (SystemUtil.isClient()) {
		return;
	}
	for (const [name, con] of scriptMap) {
		mw.Script.spawnScript(con, true).then(fun);
	}
}

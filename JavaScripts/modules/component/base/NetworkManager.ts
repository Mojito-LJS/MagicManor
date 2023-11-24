type Fn<T extends any[]> = (...args: T) => any;
type FnArgs<T> = T extends Fn<infer A> ? A : any;
/**
 * 一个类中的键
 */
export type NameAlias<T> = keyof T;
/**
 * 一个类里的方法参数的类型
 * T：类
 * N：方法名
 */
export type InferFnArgs<T extends object, N extends NameAlias<T>> = FnArgs<T[N]>;
const networkMap: Map<string, NetworkEntity<any, any>> = new Map();
export function regNetworkC() {
	return function <T extends object>(constructor: mw.TypeName<T>) {
		networkMap.set(constructor.name, new NetworkEntityC(constructor));
		console.log(`regNetworkC----->${constructor.name}`);
	};
}
export function regNetworkS() {
	return function <T extends object>(constructor: mw.TypeName<T>) {
		networkMap.set(constructor.name, new NetworkEntityS(constructor));
		console.log(`regNetworkS----->${constructor.name}`);
	};
}
export function getNetWorkC<T extends object, E extends keyof T>(cls: mw.TypeName<T>) {
	return networkMap.get(cls.name) as NetworkEntityC<T, E>;
}
export function getNetWorkS<T extends object, E extends keyof T>(cls: mw.TypeName<T>) {
	return networkMap.get(cls.name) as NetworkEntityS<T, E>;
}
abstract class NetworkEntity<T extends object, E extends keyof T> {
	private _network: T;
	protected _nameMap: Map<E, string> = new Map();
	constructor(cls: mw.TypeName<T>) {
		const network = (this._network = new cls());
		for (const key of Reflect.ownKeys(cls.prototype) as string[]) {
			//!(element instanceof Function) ||
			const element = network[key] as Function;
			if (key === "constructor") {
				continue;
			}
			console.log(`NetworkEntity------->${key}`);
			const eventName = `${cls.name}-${key}-`;
			this._nameMap.set(key.toString() as E, eventName);
			this.onInit(eventName, element, network);
		}
	}

	protected abstract onInit(eventName: string, element: Function, network: T);

	/**
	 * sendMesseg
	 */
	public abstract sendMessage<N extends E>(name: N, ...args: any[]);
}
export class NetworkEntityC<T extends object, E extends keyof T> extends NetworkEntity<T, E> {
	protected onInit(eventName: string, element: Function, network: T) {
		if (SystemUtil.isClient()) {
			Event.addServerListener(eventName, (...params: any[]) => {
				element.call(network, ...params);
			});
		}
	}
	/**
	 * sendMesseg
	 */
	public sendMessage<N extends E>(name: N, player: mw.Player, ...args: InferFnArgs<T, N>) {
		const eventName = this._nameMap.get(name);
		Event.dispatchToClient(player, eventName, ...args);
	}

	/**
	 * sendMesseg
	 */
	public sendMessageAll<N extends E>(name: N, ...args: InferFnArgs<T, N>) {
		const eventName = this._nameMap.get(name);

		for (const player of mw.Player.getAllPlayers()) {
			Event.dispatchToClient(player, eventName, ...args);
		}
	}
}
export class NetworkEntityS<T extends object, E extends keyof T> extends NetworkEntity<T, E> {
	protected onInit(eventName: string, element: Function, network: T) {
		if (SystemUtil.isServer()) {
			Event.addClientListener(eventName, (player: mw.Player, ...params: any[]) => {
				element.call(network, ...params, player);
			});
		}
	}
	/**
	 * sendMesseg
	 */
	public sendMessage<N extends E>(name: N, ...args: InferFnArgs<T, N>) {
		const eventName = this._nameMap.get(name);
		Event.dispatchToServer(eventName, ...args);
	}
}

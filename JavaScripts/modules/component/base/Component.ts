type ComponentEventCallBack<T, F extends (...args: unknown[]) => void> = (c: T, ...data: Parameters<F>) => void;
export abstract class BaseComponent {
	private _ownerSign: string;
	public get ownerSign(): string {
		return this._ownerSign;
	}

	private _useUpdate: boolean;
	// get guid(): string;

	/**
	 * @description 设置对象是否使用更新
	 * @effect 调用端生效
	 */
	set useUpdate(v: boolean) {
		this._useUpdate = v;
	}
	/**
	 * @description 获取对象是否使用更新
	 * @effect 调用端生效
	 */
	get useUpdate(): boolean {
		return this._useUpdate;
	}
	private attach(ownerSign: string) {
		this._ownerSign = ownerSign;
		this.onAttach();
	}
	private start() {
		this.onStart();
	}
	private detach() {
		this._useUpdate = false;
		this.clearAgent();
		this.onDetach();
		this._ownerSign = null;
	}

	private destroy() {
		if (this._ownerSign) {
			this.detach();
		}
		this.onDestroy();
	}

	private update(deltaTime: number) {
		if (this.ownerSign && this.useUpdate) {
			this.onUpdate(deltaTime);
		}
	}
	/**
	 * @description 周期函数 onAttach的下一帧开始执行时调用
	 * @effect 调用端生效
	 */
	protected abstract onStart(): void;
	/**
	 * @description 周期函数 useUpdate 设置为 true 后,每帧被执行,设置为false,不会执行
	 * @param dt usage:与上一帧的延迟 单位:秒
	 * @effect 调用端生效
	 */
	protected abstract onUpdate(deltaTime: number): void;
	/**
	 * @description 周期函数 被销毁时调用
	 * @effect 调用端生效
	 */
	protected abstract onDestroy(): void;
	/**
	 * @description 周期函数 被挂载时调用
	 * @effect 调用端生效
	 */
	protected abstract onAttach(): void;
	/**
	 * @description 周期函数 被移除时调用
	 * @effect 调用端生效
	 */
	protected abstract onDetach(): void;
	/**
	 * @description 是否为客户端
	 * @effect 调用端生效
	 * @returns true为客户端
	 */
	isRunningClient(): boolean {
		return SystemUtil.isClient();
	}

	public abstract clearAgentOfCaller(caller: unknown);

	/**
	 * clear
	 */
	public abstract clearAgent();
}

export default class Component<T extends { [key: string]: (...args) => any }, E extends keyof T> extends BaseComponent {
	protected onStart(): void {}
	protected onUpdate(deltaTime: number): void {}
	protected onDestroy(): void {}
	protected onAttach(): void {}
	protected onDetach(): void {}
	private readonly _map: Map<E, Map<unknown, Set<ComponentEventCallBack<this, T[E]>>>> = new Map();

	public addListen<N extends E>(name: N, cell: unknown, fun: ComponentEventCallBack<this, T[N]>) {
		const map = this._map;
		if (!map.has(name)) {
			map.set(name, new Map());
		}
		const cellMap = map.get(name);
		if (!cellMap.has(cell)) {
			cellMap.set(cell, new Set());
		}
		cellMap.get(cell).add(fun);
	}

	public unListen<N extends E>(name: N, cell: unknown, fun: ComponentEventCallBack<this, T[N]>) {
		const map = this._map;
		if (!map.has(name)) {
			return;
		}
		const cellMap = map.get(name);
		if (!cellMap.has(cell)) {
			return;
		}
		const funSet = cellMap.get(cell);
		if (!cellMap.has(cell)) {
			return;
		}
		funSet.delete(fun);
		if (funSet.size === 0) {
			cellMap.delete(cell);
		}
		if (cellMap.size === 0) {
			map.delete(name);
		}
	}

	public sendMessage<N extends E>(name: N, ...args: Parameters<T[N]>) {
		const map = this._map;
		if (!map.has(name)) {
			return;
		}
		const cellMap = map.get(name);
		for (const [cell, funSet] of cellMap) {
			for (const fun of funSet) {
				fun.call(cell, this, ...args);
			}
		}
	}

	public clearAgentOfCaller(caller: unknown) {
		const map = this._map;
		for (const [name, funMap] of map) {
			if (funMap.has(caller)) {
				funMap.get(caller).clear();
				funMap.delete(caller);
			}
		}
	}

	/**
	 * clear
	 */
	public clearAgent() {
		const map = this._map;
		for (const [name, funMap] of map) {
			for (const [cell, funSet] of funMap) {
				funSet.clear();
			}
			funMap.clear();
		}
		map.clear();
	}
}

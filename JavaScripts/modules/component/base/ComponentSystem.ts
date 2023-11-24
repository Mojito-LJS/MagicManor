import { ItemConfig } from "../../../config/Item";
import { EventsName } from "../../../const/GameEnum";
import { BaseComponent } from "./Component";

class ComponentManager<T extends BaseComponent> {
	private _useUpdate: boolean;
	private _component: T[] = [];
	/**已经attach了的组件 */
	private _attachComponent: T[] = [];
	private _startComponent: T[] = [];

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

	constructor(component: { new(): T }, preCount: number) {
		for (let index = 0; index < preCount; index++) {
			this._component.push(new component());
		}
	}

	attach(componentC: { new(): T }, ownerSign: string) {
		let component = this._component.find(v => !v.ownerSign);
		if (!component) {
			component = new componentC();
			this._component.push(component);
		}
		this._attachComponent.push(component);
		component["attach"](ownerSign);
		this._startComponent.push(component);
		return component;
	}
	detach(ownerSign: string) {
		let index = this._attachComponent.findIndex(v => v.ownerSign === ownerSign);
		if (index !== -1) {
			this._attachComponent[index]["detach"]();
			this._attachComponent.splice(index, 1);
		}
	}
	/**
	 * @description 周期函数 被销毁时调用
	 * @effect 调用端生效
	 */
	destroy(): void {
		this._attachComponent.length = 0;
		for (const component of this._component) {
			component["destroy"]();
		}
		this._component.length = 0;
	}
	/**
	 * @description 周期函数 useUpdate 设置为 true 后,每帧被执行,设置为false,不会执行
	 * @param dt usage:与上一帧的延迟 单位:秒
	 * @effect 调用端生效
	 */
	update(deltaTime: number): void {
		for (const component of this._attachComponent) {
			component["update"](deltaTime);
		}
		for (const component of this._startComponent) {
			component["start"]();
		}
		this._startComponent.length = 0;
	}

	hasComponent(ownerSign: string) {
		return this._attachComponent.findIndex(v => v.ownerSign === ownerSign) !== -1;
	}

	/**
	 * 查找组件
	 * @param ownerSign
	 * @returns
	 */
	getComponent(): ReadonlyArray<T>;
	getComponent(ownerSign: string): T;
	getComponent(ownerSign?: string): T | ReadonlyArray<T> {
		if (!ownerSign) {
			return [...this._attachComponent];
		}
		for (const component of this._attachComponent) {
			if (component.ownerSign === ownerSign) {
				return component;
			}
		}
		return undefined;
	}

	getAllOwnerSign() {
		return this._attachComponent.map(v => v.ownerSign);
	}
}

export default class ComponentSystem {
	private static _useUpdate: boolean;
	private static _mgrMap: Map<string, ComponentManager<BaseComponent>> = new Map();

	/**每个Sign对应的组件名的map */
	private static _ownerSignMap: Map<string, { [key: string]: BaseComponent }> = new Map();
	// get guid(): string;

	/**
	 * @description 设置对象是否使用更新
	 * @effect 调用端生效
	 */
	static set useUpdate(v: boolean) {
		this._useUpdate = v;
	}
	/**
	 * @description 获取对象是否使用更新
	 * @effect 调用端生效
	 */
	static get useUpdate(): boolean {
		return this._useUpdate;
	}
	static register(component: { new(): BaseComponent }, preCount: number = 10) {
		this._mgrMap.set(component.name, new ComponentManager(component, preCount));
	}

	/**
	 * 绑定一个组件
	 * @param component 组件的类
	 * @param ownerSign 唯一的标识
	 * @returns 绑定成功返回组件实例，否则返回undefined
	 */
	static attach<T extends BaseComponent>(component: { new(): T }, ownerSign: string): T {
		const name = component.name;
		const signMap = this._ownerSignMap;
		const mgrMap = this._mgrMap;
		if (!mgrMap.has(name)) {
			console.warn("typeError: ----->没有组件：", name);
			return undefined;
		}
		if (!signMap.has(ownerSign)) {
			//没有ownerSign
			const item = {};
			const ce = mgrMap.get(name).attach(component, ownerSign) as T;
			item[name] = ce;
			signMap.set(ownerSign, item);
			return ce;
		}
		const nameArray = signMap.get(ownerSign);
		if (nameArray[name]) {
			//有这个component
			return mgrMap.get(name).getComponent(ownerSign) as T;
		}
		const ce = mgrMap.get(name).attach(component, ownerSign) as T;
		nameArray[name] = ce;
		return ce;
	}

	/**
	 * 解绑一个组件
	 * @param ownerSign 唯一的标识
	 * @param component 组件的类，不传则解绑所有{@link ownerSign}下的组件
	 */
	static detach<T extends BaseComponent>(ownerSign: string): void;
	static detach<T extends BaseComponent>(ownerSign: string, component: { new(): T }): void;
	static detach<T extends BaseComponent>(ownerSign: string, component?: { new(): T }) {
		const map = this._mgrMap;
		const signMap = this._ownerSignMap;
		const signSet = signMap.get(ownerSign);
		// 没有传递具体的组件，则解绑所有的组件;
		if (!component) {
			for (const iterator of map.values()) {
				iterator.detach(ownerSign);
			}
			if (signSet) {
				signMap.delete(ownerSign);
			}
			return;
		}

		// 解绑特定的组件
		const name = component.name;
		if (!map.has(name)) {
			console.warn("typeError: ----->没有组件：", name);
			return;
		}
		map.get(name).detach(ownerSign);
		if (signSet) {
			// 删除component
			// signSet.delete(name);
			delete signSet[name];
		}
		if (Object.keys(signSet).length === 0) {
			//移除ownerSign
			signMap.delete(ownerSign);
		}
	}

	/**
	 * 销毁组件
	 * @param component 组件的类，不传则销毁所有的组件
	 */
	static destroy<T extends BaseComponent>(): void;
	static destroy<T extends BaseComponent>(component: { new(): T }): void;
	static destroy<T extends BaseComponent>(component?: { new(): T }) {
		const map = this._mgrMap;
		const signMap = this._ownerSignMap;
		// 没有传递具体的组件，则销毁所有组件
		if (!component) {
			for (const iterator of map.values()) {
				iterator.destroy();
			}
			map.clear();
			// 清除sign
			for (const set of signMap.values()) {
				for (const iterator of Object.keys(set)) {
					delete set[iterator];
				}
			}
			signMap.clear();
			return;
		}

		const name = component.name;
		if (!map.has(name)) {
			console.warn("typeError: ----->没有组件：", name);
			return;
		}

		map.get(name).destroy();
		map.delete(name);

		// 更新sign的map
		for (const [sign, set] of signMap.entries()) {
			delete set[name];
			if (Object.keys(set).length === 0) {
				signMap.delete(sign);
			}
		}
	}
	/**
	 * @description 周期函数 useUpdate 设置为 true 后,每帧被执行,设置为false,不会执行
	 * @param dt usage:与上一帧的延迟 单位:秒
	 * @effect 调用端生效
	 */
	static update(deltaTime: number): void {
		for (const mgr of this._mgrMap.values()) {
			mgr.update(deltaTime);
		}
	}

	static hasComponent<T extends BaseComponent>(ownerSign: string, component: { new(): T }) {
		const map = this._mgrMap;
		const name = component.name;
		if (!map.has(name)) {
			console.warn("typeError: ----->没有组件：", name);
			return false;
		}
		if (ownerSign) {
			return this._ownerSignMap.has(ownerSign) && !!this._ownerSignMap.get(ownerSign)[name];
		}
	}
	/**
	 * 查找所有正在使用的组件
	 * @param component 组件的类
	 * @returns
	 */
	static getComponent<T extends BaseComponent>(component: { new(): T }): ReadonlyArray<T>;
	/**
	 * 查找组件
	 * @param component 组件的类
	 * @param ownerSign 使用标识
	 * @returns
	 */
	static getComponent<T extends BaseComponent>(component: { new(): T }, ownerSign: string): T;
	static getComponent<T extends BaseComponent>(component: { new(): T }, ownerSign?: string): T | ReadonlyArray<T> {
		const map = this._mgrMap;
		const name = component.name;
		if (!map.has(name)) {
			console.warn("typeError: ----->没有组件：", name);
			return undefined;
		}
		if (ownerSign) {
			if (this._ownerSignMap.has(ownerSign)) {
				return this._ownerSignMap.get(ownerSign)[name] as T;
			}
			console.warn(`typeError: ${ownerSign}----->没有组件：`, name);
			return undefined;
		}
		return map.get(name).getComponent() as ReadonlyArray<T>;
	}

	static getEntity(): { [key: string]: BaseComponent }[];
	static getEntity(ownerSign: string): { [key: string]: BaseComponent };
	static getEntity(ownerSign?: string): { [key: string]: BaseComponent }[] | { [key: string]: BaseComponent } {
		if (ownerSign) {
			return this._ownerSignMap.get(ownerSign);
		}
		return [...this._ownerSignMap.values()];
	}
}
export function component(preCount: number = 10) {
	return function <T extends BaseComponent>(constructor: { new(): T }) {
		ComponentSystem.register(constructor, preCount);
	};
}

mw.Event.addLocalListener(EventsName.RemoveNightEntity, (guid: string) => {
	ComponentSystem.detach(guid);
});

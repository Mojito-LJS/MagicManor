import { TagEvent } from "./core/TagEvents";
import { TagContainer } from "./TagsContainer";

export class TagCountContainer {
	private tagRef: Map<string, number> = new Map();

	private innerTagContainer: TagContainer;

	private dueToMe: boolean = false;

	add(tag: string | string[], silently?: boolean): string[] {
		this.dueToMe = true;
		const waitAdded = this.recheckArgs(tag);
		const trulyAdded = [];
		for (const addedTag of waitAdded) {
			if (!this.tagRef.has(addedTag)) {
				this.tagRef.set(addedTag, 0);
				this.innerTagContainer.addTag(tag, silently);
			}
			let oldValue = this.tagRef.get(addedTag);
			this.tagRef.set(addedTag, oldValue++);
		}
		this.dueToMe = false;
		return trulyAdded;
	}

	public bindChildContainer(child: TagContainer) {
		if (this.innerTagContainer) {
			this.clear();
		}
		this.innerTagContainer = child;
		this.copy();
		child.addListen(TagEvent.tagAdded, this, this.onChildAdded);
		child.addListen(TagEvent.tagRemoved, this, this.onChildRemoved);
	}

	private copy() {
		const tags = this.innerTagContainer.tags.concat();
		this.add(tags);
	}

	private onChildAdded(tags: string[]) {
		// 避免死循环
		if (this.dueToMe) {
			return;
		}
		this.add(tags);
	}

	private onChildRemoved(tags: string[]) {
		// 避免死循环
		if (this.dueToMe) {
			return;
		}
		this.remove(tags);
	}

	/**
	 * 查询该tag容器是否包含每一个传入的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回true, {"A","B"}.HasAll({"A.1","B.1"}) 返回false
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAll(tags: string | string[]): boolean {
		return this.innerTagContainer.hasAll(tags);
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回true, {"A","B"}.hasAny({"1"}) 返回false
	 */
	hasAny(tags: string | string[]): boolean {
		return this.innerTagContainer.hasAny(tags);
	}

	/**
	 * 查询该tag容器是否包含每一个传入的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回false, {"A.1","B.2"}.HasAll({"1","2"}) 返回true
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAllExact(tags: string | string[]): boolean {
		return this.innerTagContainer.hasAllExact(tags);
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回false, {"A.1","B.2"}.hasAny({"1",'3','2'}) 返回true
	 */
	hasAnyExact(tags: string | string[]): boolean {
		return this.innerTagContainer.hasAnyExact(tags);
	}

	remove(tags: string | string[]): string[] {
		this.dueToMe = true;
		const waitRemoved = this.recheckArgs(tags);
		const trulyRemoved = [];

		for (const removalTag of waitRemoved) {
			if (!this.tagRef.has(removalTag)) {
				// 计数表里没有?
				continue;
			}
			let oldValue = this.tagRef.get(removalTag);
			this.tagRef.set(removalTag, oldValue--);

			if (oldValue <= 0) {
				// 计数为0了，remove掉
				this.tagRef.delete(removalTag);
				this.innerTagContainer.remove(removalTag);
				trulyRemoved.push(removalTag);
			}
		}

		this.dueToMe = false;
		return trulyRemoved;
	}

	clear(): void {
		this.tagRef.clear();
		this.innerTagContainer.clearAgent();
		this.innerTagContainer = null;
	}

	get length(): number {
		return this.innerTagContainer.length;
	}

	isEmpty(): boolean {
		return this.innerTagContainer.isEmpty();
	}

	public get tags(): readonly string[] {
		return this.innerTagContainer.tags;
	}

	addListen(type: any, caller: unknown, listener: (...args: any[]) => any) {
		this.innerTagContainer.addListen(type, caller, listener);
	}

	offAllCaller(caller: unknown) {
		this.innerTagContainer.clearAgentOfCaller(caller);
	}

	private recheckArgs(tag: string | string[]): string[] {
		let query: string[];
		if (typeof tag === "string") {
			query = [tag];
		} else {
			query = tag;
		}
		return query;
	}
}

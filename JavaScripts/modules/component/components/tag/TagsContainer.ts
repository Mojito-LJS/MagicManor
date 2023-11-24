/*
 * @Author: minjia.zhang
 * @Date: 2022-10-26 14:56:43
 * @LastEditors: minjia.zhang
 * @LastEditTime: 2022-11-10 15:57:21
 * @FilePath: \huntroyale\JavaScripts\modules\corebattle\extras\tags\TagsContainer.ts
 * @Description:
 */

import { ActAsAgent } from "../../base/TypeEvent";
import { ITagContainer } from "./ITagContainerOwner";
import { TagAgentFun } from "./TagComponent";
import { TagEvent } from "./core/TagEvents";
import { TagManager } from "./core/TagsManager";

/**
 * 实现{@link ITagContainer}
 * tag容器当有tag操作时，会有对应的事件抛出
 */
export class TagContainer extends ActAsAgent<TagAgentFun, keyof TagAgentFun> {
	private _tagSet: Set<string> = new Set();

	private _parentTags: Set<string> = new Set();

	/**
	 * 查询该tag容器是否包含每一个传入的tag, 匹配父tag和完整的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回true, {"A","B"}.HasAll({"A.1","B.1"}) 返回false, {"A","B"}.HasAll({"A.1","B"}) 返回false
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAll(tags: string | string[]): boolean {
		if (!tags) {
			return true;
		}
		const querys = this.recheckArgs(tags);

		if (this.isEmpty()) {
			return true;
		}
		for (const otherTag of querys) {
			if (!this._tagSet.has(otherTag) && !this._parentTags.has(otherTag)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag, 匹配父tag和完整的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回true, {"A","B"}.hasAny({"1"}) 返回false
	 *  当tags为空或时返回false
	 */
	hasAny(tags: string | string[]): boolean {
		if (!tags) {
			return false;
		}
		const querys = this.recheckArgs(tags);

		if (this.isEmpty()) {
			return false;
		}
		for (const otherTag of querys) {
			if (this._tagSet.has(otherTag) || this._parentTags.has(otherTag)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 查询该tag容器是否包含每一个传入的tag,匹配完整的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回false, {"A.1","B.2"}.HasAll({"A.1","B.2"}) 返回true
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAllExact(tags: string | string[]): boolean {
		if (!tags) {
			return true;
		}
		const querys = this.recheckArgs(tags);
		for (const tag of querys) {
			if (!this._tagSet.has(tag)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag, 匹配完整的tag,不匹配父tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回false, {"A.1","B.2"}.hasAny({"1",'3','2'}) 返回true
	 */
	hasAnyExact(tags: string | string[]): boolean {
		if (!tags) {
			return false;
		}
		const querys = this.recheckArgs(tags);
		for (const tag of querys) {
			if (this._tagSet.has(tag)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 添加tag
	 * @param tag
	 * @param silently 是否不同步,默认不同步
	 */
	addTag(tag: string | string[], silently: boolean = false): void {
		const toAddedList = this.recheckArgs(tag);
		for (const toAdded of toAddedList) {
			if (this._tagSet.has(toAdded)) {
				continue;
			}
			const tagNode = TagManager.ins.findTagNode(toAdded);
			if (!tagNode) {
				continue;
			}
			this._tagSet.add(toAdded);
			this.addParentsForTag(toAdded);
			!silently && this.sendMessage(TagEvent.tagAdded, [toAdded]);
		}
	}

	remove(tags: string | string[], silently: boolean = false): void {
		const toRemovedList = this.recheckArgs(tags);

		for (const toRemoved of toRemovedList) {
			if (!this._tagSet.has(toRemoved)) {
				return;
			}
			this._tagSet.delete(toRemoved);
			!silently && this.sendMessage(TagEvent.tagRemoved, [toRemoved]);
		}
		if (toRemovedList.length > 0) {
			this.fillParentTags();
			!silently && this.sendMessage(TagEvent.tagRemoved, toRemovedList);
		}
	}

	removeFromParent(tag: string): void {
		const toRemoved = TagManager.ins.findTagNode(tag);
		if (!toRemoved) {
			return;
		}
		if (!this._parentTags.has(tag)) {
			return;
		}

		const tags = this._tagSet;
		const needRemoved: string[] = [];
		for (const tag of tags) {
			const node = TagManager.ins.findTagNode(tag);
			if (node.match(toRemoved)) {
				needRemoved.push(tag);
			}
		}
		this.remove(needRemoved);
	}

	removeAllTag() {
		this._tagSet.clear();
		this._parentTags.clear();
	}
	clear(): void {
		this._tagSet.clear();
		this._parentTags.clear();
	}

	get length(): number {
		return this._tagSet.size;
	}

	/**是否为空 */
	isEmpty(): boolean {
		return this.length === 0;
	}

	public get tags(): Readonly<string[]> {
		return [...this._tagSet];
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

	private addParentsForTag(tag: string) {
		const tagNode = TagManager.ins.findTagNode(tag);
		if (tagNode) {
			for (const tagName of tagNode.getParentTagNames()) {
				this._parentTags.add(tagName);
			}
		}
	}

	private fillParentTags() {
		this._parentTags.clear();
		for (const tag of this._tagSet) {
			this.addParentsForTag(tag);
		}
	}
}

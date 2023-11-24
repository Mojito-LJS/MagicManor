/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-27 14:42:20
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-27 15:31:55
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\core\tags\TagComponent.ts
 * @Description  : 修改描述
 */

import Component from "../../base/Component";
import { component } from "../../base/ComponentSystem";
import { TagEvent } from "./core/TagEvents";
import { TagContainer } from "./TagsContainer";
export type TagAgentFun = {
	tagAdded(tags: string[]): void;
	tagRemoved(tags: string[]): void;
};


@component(30)
export class TagComponent extends Component<TagAgentFun, TagEvent> {
	/**
	 * 查询该tag容器是否包含每一个传入的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回true, {"A","B"}.HasAll({"A.1","B.1"}) 返回false
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAll(tags: string | string[]): boolean {
		return this.tagContainer.hasAll(tags);
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回true, {"A","B"}.hasAny({"1"}) 返回false
	 */
	hasAny(tags: string | string[]): boolean {
		return this.tagContainer.hasAny(tags);
	}

	/**
	 * 查询该tag容器是否包含每一个传入的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回false, {"A.1","B.2"}.HasAll({"1","2"}) 返回true
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	hasAllExact(tags: string | string[]): boolean {
		return this.tagContainer.hasAllExact(tags);
	}

	/**
	 * 查询该容器是否包含任意一个传入的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回false, {"A.1","B.2"}.hasAny({"1",'3','2'}) 返回true
	 */
	hasAnyExact(tags: string | string[]): boolean {
		return this.tagContainer.hasAnyExact(tags);
	}

	addTag(tags: string | string[], silently?: boolean): void {
		this.tagContainer.addTag(tags, silently);
	}

	removeTag(tags: string | string[]): void {
		this.tagContainer.remove(tags);
	}

	removeFromParent(tag: string): void {
		this.tagContainer.removeFromParent(tag);
	}

	removeAllTag() {
		this.tagContainer.removeAllTag();
	}

	clear(): void {
		this.tagContainer.clear();
	}

	get length(): number {
		return this.tagContainer.length;
	}

	isEmpty(): boolean {
		return this.tagContainer.isEmpty();
	}

	public get tags(): readonly string[] {
		return this.tagContainer.tags;
	}

	private tagContainer: TagContainer = new TagContainer();

	protected onAttach(): void {
		this.tagContainer.addListen(TagEvent.tagAdded, this, this.tagAdded);
		this.tagContainer.addListen(TagEvent.tagRemoved, this, this.tagRemoved);
	}

	protected onDetach(): void {
		this.tagContainer.clear();
	}

	private tagAdded(tags: string[]) {
		this.sendMessage(TagEvent.tagAdded, tags);
	}

	private tagRemoved(tags: string[]) {
		this.sendMessage(TagEvent.tagRemoved, tags);
	}
}

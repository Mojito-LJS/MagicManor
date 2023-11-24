export class TagNode {
	private _childNodes: TagNode[] = [];

	private _parentTags: string[] = [];

	constructor(readonly simpleTag: string, readonly completeTag: string, readonly parentNode: TagNode) {
		if (parentNode) {
			this._parentTags.push(parentNode.completeTag);
			this._parentTags.push(...parentNode._parentTags);
		}
	}

	public getChildTagNodes(): TagNode[] {
		return this._childNodes;
	}

	/**
	 * 测试两个标签是否匹配
	 * @param tag
	 * @returns
	 */
	match(tag: Readonly<TagNode>) {
		if (tag.simpleTag === this.simpleTag) {
			return true;
		}
		if (this.parentNode) {
			return this.parentNode.match(tag);
		}
		return false;
	}

	public getParentTagNames(): Readonly<string[]> {
		return this._parentTags;
	}
}

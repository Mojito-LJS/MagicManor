import { TagNode } from "./TagNode";

/**
 * 默认前缀
 */
const TAG_PREFIX = "Identifier";

const TAG_INDEX = "tag";

const FULL_TAG_INDEX = "simpleTag";

const INDEX_NONE = -1;

interface ITagClass {}
export enum TagType {
	/**
	 * 查询该容器是否包含任意一个传入的tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回true, {"A","B"}.hasAny({"1"}) 返回false
	 */
	Any,
	/**
	 * 查询该容器是否包含任意一个传入的tag, 匹配完整的tag,不匹配父tag
	 *  {"A.1","B.1"}.hasAny({"A"}) 返回false, {"A.1","B.2"}.hasAny({"1",'3','2'}) 返回true
	 */
	AnyExact,
	/**
	 * 查询该tag容器是否包含每一个传入的tag, 匹配父tag和完整的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回true, {"A","B"}.HasAll({"A.1","B.1"}) 返回false, {"A","B"}.HasAll({"A.1","B"}) 返回false
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	All,
	/**
	 * 查询该tag容器是否包含每一个传入的tag,匹配完整的tag
	 * {"A.1","B.1"}.hasAll({"A","B"}) 返回false, {"A.1","B.2"}.HasAll({"A.1","B.2"}) 返回true
	 * 如果全部包含，或者该容器为空，则返回true
	 */
	AllExact,
}
/**
 * 注册一个Gameplay tag
 * @param prefix 最上层的前缀
 * @returns
 */
export function tagI(alias?: string, prefix: string = TAG_PREFIX) {
	return function <T extends ITagClass>(constructor: mw.TypeName<T>): any {
		const keys = Object.keys(constructor);
		const nodeName = alias || `${constructor.name}`;
		const fullNodeName = `${prefix}.${nodeName}`;
		constructor[FULL_TAG_INDEX] = nodeName;
		constructor[TAG_INDEX] = fullNodeName;
		for (const tagName of keys) {
			const fullName = `${fullNodeName}.${tagName}`;
			TagManager.ins.registerTagNode(fullName);
			constructor[tagName] = fullName;
		}
		return constructor;
	};
}

export class TagManager {
	private static _instance: TagManager;

	public static get ins(): TagManager {
		if (!this._instance) {
			this._instance = new TagManager();
		}
		return this._instance;
	}

	private _tagRoot: TagNode = new TagNode("", "", null);

	private _tagMap: Map<string, TagNode> = new Map();

	private insertTagToNodeArray(shortName: string, fullName: string, parentNode: TagNode, nodeArray: TagNode[]): number {
		let foundNodeIndex = INDEX_NONE;
		let whereToInsert = INDEX_NONE;

		for (let curIdx = 0; curIdx < nodeArray.length; curIdx++) {
			const currNode = nodeArray[curIdx];

			if (currNode) {
				const toCheck = currNode.simpleTag;
				if (toCheck === shortName) {
					foundNodeIndex = curIdx;
					break;
				} else if (toCheck.charAt(0) < shortName.charAt(0) && whereToInsert === INDEX_NONE) {
					//按照首字母排序
					whereToInsert = curIdx;
					break;
				}
			}
		}

		if (foundNodeIndex === INDEX_NONE) {
			if (whereToInsert === INDEX_NONE) {
				whereToInsert = nodeArray.length;
			}
			const tagNode = new TagNode(shortName, fullName, parentNode === this._tagRoot ? null : parentNode);
			nodeArray.splice(whereToInsert, 0, tagNode);
			const completeTag = tagNode.completeTag;
			this._tagMap.set(completeTag, tagNode);
			foundNodeIndex = whereToInsert;
		}
		return foundNodeIndex;
	}

	/**
	 * 注册tag到tagManager
	 * 只有注册过的tag才会被视为合法tag
	 * @param tag
	 */
	public registerTagNode(tag: string) {
		const subTags = tag.split(".");
		const numSubTags = subTags.length;
		let fullTagName = "";
		let curNode = this._tagRoot;
		for (let i = 0; i < numSubTags; i++) {
			//是否是最后一个tag
			const isExplicitTag = i === numSubTags - 1;
			const shortTagName = subTags[i];

			if (isExplicitTag) {
				//直接设置为原字符串
				fullTagName = tag;
			} else if (i === 0) {
				fullTagName = shortTagName;
			} else {
				fullTagName += ".";
				fullTagName += shortTagName;
			}
			const childTags = curNode.getChildTagNodes();
			const insertIdx = this.insertTagToNodeArray(shortTagName, fullTagName, curNode, childTags);
			curNode = childTags[insertIdx];
		}
	}

	/**
	 * 获取字符串对应的tag节点
	 * @param tag
	 * @returns
	 */
	public findTagNode(tag: string): Readonly<TagNode> {
		return this._tagMap.get(tag);
	}

	/**
	 * 获取一个标签对应父节点
	 * @param tag
	 * @returns
	 */
	public requestTagDirectParent(tag: string): Readonly<TagNode> {
		const node = this.findTagNode(tag);
		if (node) {
			return node.parentNode;
		}
		return null;
	}
}

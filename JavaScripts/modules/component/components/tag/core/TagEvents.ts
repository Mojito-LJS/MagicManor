export enum TagEvent {
	/**
	 * 当有一个tag被添加时 事件会携带被添加的标签名
	 * callback = (addedTags:string)=>void;
	 */
	tagAdded = "tagAdded",

	/**
	 * 当一个tag被移除时 事件会携带被移除的标签名
	 * callback = (removeTags:string)=>void;
	 */
	tagRemoved = "tagRemoved",
}

/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-27 14:42:20
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-27 15:32:53
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\core\tags\core\TagEvents.ts
 * @Description  : 修改描述
 */
/*
 * @Author: minjia.zhang
 * @Date: 2022-10-26 15:16:33
 * @LastEditors: minjia.zhang
 * @LastEditTime: 2022-11-02 11:26:26
 * @FilePath: \protobrother-demo\JavaScripts\tags\TagEvents.ts
 * @Description: 用来存放Tag的事件
 */
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

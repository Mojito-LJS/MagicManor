/** 
 * @Author       : peiwen.chen
 * @Date         : 2023-03-05 17:15:56
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-07 15:39:38
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\logic\attribute\aggregator\AttrSetSource.ts
 * @Description  : 修改描述
 */



export interface AttrContextInfo {

    /**
     * buff的来源
     */
    from: string;

    /**
     * buff的目标
     */
    to: string;

    /**
     * buff来源来源
     */
    source?: unknown
}
export interface AttrSetSource {
    /**唯一标识 */
    sign: string
    /**
     * 叠加层数
     */
    stackCount: number
    /**伤害上下文 */
    contextInfo: AttrContextInfo
}

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
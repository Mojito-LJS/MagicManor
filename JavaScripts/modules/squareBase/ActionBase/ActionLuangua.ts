export class ActionLuanguage {

    public static isOverseas = !mw.LocaleUtil.getDefaultLocale().toString().toLowerCase().match("zh");

    //多语言
    /**接受动作文本 */
    public static acceptText: string = "";
    /**拒绝动作文本 */
    public static refuseText: string = "";
    /**发起描述1 */
    public static desc1: string = "";
    /**发起描述2 */
    public static desc2: string = "";
    /**接受按钮图标 */
    // public static acceptGuid: string = "";
    /**动作Item背景图 */
    // public static itemBg: string = "";
    /**与交互物互斥提示 */
    public static interactiveTips: string = "";
    /**与道具互斥提示 */
    public static itemType: string = "";
    /**重复发起动作提示 */
    public static actionTips: string = "";
    /**动作发起成功提示 */
    public static succes: string = "";
    /**动作发起失败提示 */
    public static fail: string = "";
    /**脱离 */
    public static leave: string = "";
    /**动作按钮文字 */
    public static action: string = "";
    /**脱离按钮图标 */
    // public static leaveIcon: string = "";
    /**页签1 */
    public static tab1: string = "";
    /**页签2 */
    public static tab2: string = "";
    /**页签底图 */
    // public static tabBg: string = "";
    /**距离过远 */
    public static toolong: string = "";
    /**当前玩家处于双人动作中 */
    public static ing: string = "";
    /**请先离开当前玩家 */
    public static pleaseLeave: string = "";
}

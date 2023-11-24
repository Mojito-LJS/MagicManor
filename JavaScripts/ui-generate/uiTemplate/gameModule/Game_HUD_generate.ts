 

 @UIBind('UI/uiTemplate/gameModule/Game_HUD.ui')
 export default class Game_HUD_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/JoyStick/mBtn_Trans')
    public mBtn_Trans: mw.Button=undefined;
    @UIWidgetBind('Canvas/mRightDownCon')
    public mRightDownCon: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mJump_btn')
    public mJump_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mItemAction_btn')
    public mItemAction_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mExitInteractive_btn')
    public mExitInteractive_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mGet')
    public mGet: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mGet/mget_back')
    public mget_back: mw.Image=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mGet/mget_btn')
    public mget_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mIdCard_btn')
    public mIdCard_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mPulloff_btn')
    public mPulloff_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/canvas_emoji')
    public canvas_emoji: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_emoji/scrollBox_emoji')
    public scrollBox_emoji: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/canvas_word')
    public canvas_word: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_word/scrollBox_word')
    public scrollBox_word: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/canvas_btn')
    public canvas_btn: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_btn/emojiBtn')
    public emojiBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/canvas_btn/wordBtn')
    public wordBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvas_choose')
    public mCanvas_choose: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_choose/mBtn_choose')
    public mBtn_choose: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasCamera')
    public mCanvasCamera: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasCamera/mButton_1')
    public mButton_1: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasAction')
    public mCanvasAction: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasAction/mAction_btn')
    public mAction_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasAction/mAction_btn/textBtn')
    public textBtn: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasCloth')
    public mCanvasCloth: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasCloth/mBtnCloth')
    public mBtnCloth: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasSky')
    public mCanvasSky: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasSky/mBtnSky')
    public mBtnSky: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasSky/mIconSky')
    public mIconSky: mw.Image=undefined;
    @UIWidgetBind('Canvas/mCanvasInvite')
    public mCanvasInvite: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasInvite/mBtnInvite')
    public mBtnInvite: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasInvite/mIconInvite')
    public mIconInvite: mw.Image=undefined;
    @UIWidgetBind('Canvas/mCanvasInvite/mTextInvite')
    public mTextInvite: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasEditor')
    public mCanvasEditor: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasEditor/mBtnEditor')
    public mBtnEditor: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasEditor/mLightEditor')
    public mLightEditor: mw.Image=undefined;
    @UIWidgetBind('Canvas/mCanvasEditor/mIconEditor')
    public mIconEditor: mw.Image=undefined;
    @UIWidgetBind('Canvas/mCanvasEditor/mTextEditor')
    public mTextEditor: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasTime')
    public mCanvasTime: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasTime/mTimetext')
    public mTimetext: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasTime/mTimeCount')
    public mTimeCount: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasReturn')
    public mCanvasReturn: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasReturn/returnSchoolBtn')
    public returnSchoolBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mBagBtn')
    public mBagBtn: mw.Button=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mJump_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mJump_btn");
         })
         this.mJump_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mJump_btn");
         })
         this.mJump_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mJump_btn");
         })
         this.mJump_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mItemAction_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mItemAction_btn");
         })
         this.mItemAction_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mItemAction_btn");
         })
         this.mItemAction_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mItemAction_btn");
         })
         this.mItemAction_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mExitInteractive_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mget_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mget_btn");
         })
         this.mget_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mget_btn");
         })
         this.mget_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mget_btn");
         })
         this.mget_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.emojiBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "emojiBtn");
         })
         this.emojiBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "emojiBtn");
         })
         this.emojiBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "emojiBtn");
         })
         this.emojiBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.wordBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "wordBtn");
         })
         this.wordBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "wordBtn");
         })
         this.wordBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "wordBtn");
         })
         this.wordBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnCloth.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnCloth");
         })
         this.mBtnCloth.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnCloth");
         })
         this.mBtnCloth.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnCloth");
         })
         this.mBtnCloth.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnSky.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnSky");
         })
         this.mBtnSky.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnSky");
         })
         this.mBtnSky.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnSky");
         })
         this.mBtnSky.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnInvite.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnInvite");
         })
         this.mBtnInvite.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnInvite");
         })
         this.mBtnInvite.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnInvite");
         })
         this.mBtnInvite.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnEditor.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnEditor");
         })
         this.mBtnEditor.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnEditor");
         })
         this.mBtnEditor.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnEditor");
         })
         this.mBtnEditor.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtn_Trans.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_Trans");
         })
         this.mBtn_Trans.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_Trans");
         })
         this.mBtn_Trans.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_Trans");
         })
         this.mBtn_Trans.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mIdCard_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mIdCard_btn");
         })
         this.mIdCard_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mIdCard_btn");
         })
         this.mIdCard_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mIdCard_btn");
         })
         this.mIdCard_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mPulloff_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mPulloff_btn");
         })
         this.mPulloff_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mPulloff_btn");
         })
         this.mPulloff_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mPulloff_btn");
         })
         this.mPulloff_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_choose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_choose");
         })
         this.mBtn_choose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_choose");
         })
         this.mBtn_choose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_choose");
         })
         this.mBtn_choose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_1");
         })
         this.mButton_1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_1");
         })
         this.mButton_1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_1");
         })
         this.mButton_1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mAction_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mAction_btn");
         })
         this.mAction_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mAction_btn");
         })
         this.mAction_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mAction_btn");
         })
         this.mAction_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.returnSchoolBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "returnSchoolBtn");
         })
         this.returnSchoolBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "returnSchoolBtn");
         })
         this.returnSchoolBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "returnSchoolBtn");
         })
         this.returnSchoolBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBagBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBagBtn");
         })
         this.mBagBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBagBtn");
         })
         this.mBagBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBagBtn");
         })
         this.mBagBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mJump_btn);
	
         this.setLanguage(this.mItemAction_btn);
	
         this.setLanguage(this.mExitInteractive_btn);
	
         this.setLanguage(this.mget_btn);
	
         this.setLanguage(this.emojiBtn);
	
         this.setLanguage(this.wordBtn);
	
         this.setLanguage(this.mBtnCloth);
	
         this.setLanguage(this.mBtnSky);
	
         this.setLanguage(this.mBtnInvite);
	
         this.setLanguage(this.mBtnEditor);
	
         //文本多语言
         this.setLanguage(this.textBtn)
	
         this.setLanguage(this.mTextInvite)
	
         this.setLanguage(this.mTextEditor)
	
         this.setLanguage(this.mTimetext)
	
         this.setLanguage(this.mTimeCount)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mIdCard_btn/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mPulloff_btn/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasCamera/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasCloth/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasSky/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasReturn/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mBagBtn/TextBlock") as mw.TextBlock);
	
 
     }
     
     private setLanguage(ui: mw.StaleButton | mw.TextBlock) {
         let call = mw.UIScript.getBehavior("lan");
         if (call && ui) {
             call(ui);
         }
     }
     
     /**
       * 设置显示时触发
       */
     public show(...params: unknown[]) {
         mw.UIService.showUI(this, this.layer, ...params)
     }
 
     /**
      * 设置不显示时触发
      */
     public hide() {
         mw.UIService.hideUI(this)
     }
 
     protected onStart(): void{};
     protected onShow(...params: any[]): void {};
     protected onHide():void{};
 
     protected onUpdate(dt: number): void {
 
     }
     /**
      * 设置ui的父节点
      * @param parent 父节点
      */
     setParent(parent: mw.Canvas){
         parent.addChild(this.uiObject)
         this.uiObject.size = this.uiObject.size.set(this.rootCanvas.size)
     }
 }
 
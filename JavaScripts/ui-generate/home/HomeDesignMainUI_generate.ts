 

 @UIBind('UI/home/HomeDesignMainUI.ui')
 export default class HomeDesignMainUI_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mCloseBtn')
    public mCloseBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas')
    public mBuyItemCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot')
    public mScrollItemCanvasRoot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot/mItemCanvas')
    public mItemCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot/mItemCanvas/mBackBtnCanvas')
    public mBackBtnCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot/mItemCanvas/mBackBtnCanvas/mBackBtn')
    public mBackBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot/mItemCanvas/mScrollBox')
    public mScrollBox: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mScrollItemCanvasRoot/mItemCanvas/mScrollBox/mScrollCanvas')
    public mScrollCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot')
    public mBtnGroupCanvasRoot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mTypeBtn1')
    public mTypeBtn1: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mTypeBtn2')
    public mTypeBtn2: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mTypeBtn3')
    public mTypeBtn3: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mVisibleCanvas')
    public mVisibleCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mVisibleCanvas/mHideBtnCanvas')
    public mHideBtnCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mVisibleCanvas/mHideBtnCanvas/mBtnHide')
    public mBtnHide: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mVisibleCanvas/mShowBtnCanvas')
    public mShowBtnCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mBtnGroupCanvasRoot/mVisibleCanvas/mShowBtnCanvas/mBtnShow')
    public mBtnShow: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mMoneyCanvasRoot')
    public mMoneyCanvasRoot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyItemCanvas/mMoneyCanvasRoot/moneyCount')
    public moneyCount: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mChangeMartialCanvas')
    public mChangeMartialCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mChangeMartialCanvas/mBtnChangeMartialCancel')
    public mBtnChangeMartialCancel: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mChangeMartialCanvas/mBtnChangeMartialSure')
    public mBtnChangeMartialSure: mw.Button=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mTypeBtn1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn1");
         })
         this.mTypeBtn1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn1");
         })
         this.mTypeBtn1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn1");
         })
         this.mTypeBtn1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBtn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn2");
         })
         this.mTypeBtn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn2");
         })
         this.mTypeBtn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn2");
         })
         this.mTypeBtn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBtn3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn3");
         })
         this.mTypeBtn3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn3");
         })
         this.mTypeBtn3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn3");
         })
         this.mTypeBtn3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnHide.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnHide");
         })
         this.mBtnHide.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnHide");
         })
         this.mBtnHide.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnHide");
         })
         this.mBtnHide.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnShow.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnShow");
         })
         this.mBtnShow.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnShow");
         })
         this.mBtnShow.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnShow");
         })
         this.mBtnShow.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mCloseBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
         })
         this.mCloseBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCloseBtn");
         })
         this.mCloseBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCloseBtn");
         })
         this.mCloseBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBackBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBackBtn");
         })
         this.mBackBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBackBtn");
         })
         this.mBackBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBackBtn");
         })
         this.mBackBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnChangeMartialCancel.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnChangeMartialCancel");
         })
         this.mBtnChangeMartialCancel.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnChangeMartialCancel");
         })
         this.mBtnChangeMartialCancel.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnChangeMartialCancel");
         })
         this.mBtnChangeMartialCancel.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnChangeMartialSure.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnChangeMartialSure");
         })
         this.mBtnChangeMartialSure.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnChangeMartialSure");
         })
         this.mBtnChangeMartialSure.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnChangeMartialSure");
         })
         this.mBtnChangeMartialSure.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mTypeBtn1);
	
         this.setLanguage(this.mTypeBtn2);
	
         this.setLanguage(this.mTypeBtn3);
	
         this.setLanguage(this.mBtnHide);
	
         this.setLanguage(this.mBtnShow);
	
         //文本多语言
         this.setLanguage(this.moneyCount)
	
 
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
 
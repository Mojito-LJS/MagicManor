 

 @UIBind('UI/home/HomeDesignOper.ui')
 export default class HomeDesignOper_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mOperCanvas')
    public mOperCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mOperCanvas/mBtnChangeColor')
    public mBtnChangeColor: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mOperCanvas/mBtnMove')
    public mBtnMove: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mOperCanvas/mPriceBtn')
    public mPriceBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mInstallOperCanvas')
    public mInstallOperCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mInstallOperCanvas/mBtnInstallSure')
    public mBtnInstallSure: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mInstallOperCanvas/mBtnInstallRotate')
    public mBtnInstallRotate: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mInstallOperCanvas/mBtnInstallCancel')
    public mBtnInstallCancel: mw.Button=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mBtnChangeColor.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnChangeColor");
         })
         this.mBtnChangeColor.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnChangeColor");
         })
         this.mBtnChangeColor.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnChangeColor");
         })
         this.mBtnChangeColor.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnMove.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnMove");
         })
         this.mBtnMove.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnMove");
         })
         this.mBtnMove.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnMove");
         })
         this.mBtnMove.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mPriceBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mPriceBtn");
         })
         this.mPriceBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mPriceBtn");
         })
         this.mPriceBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mPriceBtn");
         })
         this.mPriceBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnInstallSure.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnInstallSure");
         })
         this.mBtnInstallSure.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnInstallSure");
         })
         this.mBtnInstallSure.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnInstallSure");
         })
         this.mBtnInstallSure.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnInstallRotate.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnInstallRotate");
         })
         this.mBtnInstallRotate.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnInstallRotate");
         })
         this.mBtnInstallRotate.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnInstallRotate");
         })
         this.mBtnInstallRotate.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnInstallCancel.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnInstallCancel");
         })
         this.mBtnInstallCancel.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnInstallCancel");
         })
         this.mBtnInstallCancel.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnInstallCancel");
         })
         this.mBtnInstallCancel.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
 
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
 
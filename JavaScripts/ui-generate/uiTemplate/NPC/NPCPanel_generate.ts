 

 @UIBind('UI/uiTemplate/NPC/NPCPanel.ui')
 export default class NPCPanel_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/talkCanvas/click')
    public click: mw.Button=undefined;
    @UIWidgetBind('Canvas/talkCanvas/talkTxt')
    public talkTxt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/talkCanvas/mGoodWillTxt')
    public mGoodWillTxt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/talkCanvas')
    public talkCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/guideBtn')
    public guideBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/scroll/mBtnCon')
    public mBtnCon: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/scroll')
    public scroll: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/con1/btn1')
    public btn1: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/con1')
    public con1: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/con2/btn2')
    public btn2: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/con2')
    public con2: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btn1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn1");
         })
         this.btn1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn1");
         })
         this.btn1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn1");
         })
         this.btn1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn2");
         })
         this.btn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn2");
         })
         this.btn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn2");
         })
         this.btn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.click.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "click");
         })
         this.click.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "click");
         })
         this.click.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "click");
         })
         this.click.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.guideBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "guideBtn");
         })
         this.guideBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "guideBtn");
         })
         this.guideBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "guideBtn");
         })
         this.guideBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btn1);
	
         this.setLanguage(this.btn2);
	
         //文本多语言
         this.setLanguage(this.talkTxt)
	
         this.setLanguage(this.mGoodWillTxt)
	
 
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
 
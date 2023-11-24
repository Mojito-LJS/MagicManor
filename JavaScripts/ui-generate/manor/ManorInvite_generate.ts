 

 @UIBind('UI/manor/ManorInvite.ui')
 export default class ManorInvite_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/closeBG')
    public closeBG: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/scrollPlayer')
    public scrollPlayer: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/scrollPlayer/content')
    public content: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/manorLevel')
    public manorLevel: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/tips')
    public tips: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/loading')
    public loading: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.closeBG.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "closeBG");
         })
         this.closeBG.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "closeBG");
         })
         this.closeBG.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "closeBG");
         })
         this.closeBG.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.manorLevel)
	
         this.setLanguage(this.tips)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Title") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock") as mw.TextBlock);
	
 
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
 
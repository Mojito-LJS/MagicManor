 

 @UIBind('UI/manor/ManorPlayerItem.ui')
 export default class ManorPlayerItem_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/icon')
    public icon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/name')
    public name: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/level')
    public level: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/inviteBtn')
    public inviteBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/visitBtn')
    public visitBtn: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.inviteBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "inviteBtn");
         })
         this.inviteBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "inviteBtn");
         })
         this.inviteBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "inviteBtn");
         })
         this.inviteBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.visitBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "visitBtn");
         })
         this.visitBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "visitBtn");
         })
         this.visitBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "visitBtn");
         })
         this.visitBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.inviteBtn);
	
         this.setLanguage(this.visitBtn);
	
         //文本多语言
         this.setLanguage(this.name)
	
         this.setLanguage(this.level)
	
 
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
 
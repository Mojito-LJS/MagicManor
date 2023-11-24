 

 @UIBind('UI/task/TaskMain.ui')
 export default class TaskMain_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/taskCanvas/taskIcon')
    public taskIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/taskName')
    public taskName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/taskCondition')
    public taskCondition: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/distance')
    public distance: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/time')
    public time: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/reward')
    public reward: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas/taskDone')
    public taskDone: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/taskCanvas')
    public taskCanvas: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.reward.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "reward");
         })
         this.reward.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "reward");
         })
         this.reward.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "reward");
         })
         this.reward.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.taskName)
	
         this.setLanguage(this.taskCondition)
	
         this.setLanguage(this.distance)
	
         this.setLanguage(this.time)
	
 
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
 
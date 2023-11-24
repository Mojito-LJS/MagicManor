import { SpawnManager,SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
/** 
 * @Author       : 陆江帅
 * @Date         : 2023-06-02 16:08:10
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-29 10:25:08
 * @FilePath     : \magicmanor\JavaScripts\modules\building\Building.ts
 * @Description  : 
 */

export class Building {
    public id: number;
    public obj: mw.GameObject
    public isActive: boolean = false
    public guid: string;

    constructor(id: number, guid: string) {
        this.id = id;
        this.guid = guid;
    }

    public async spawn(isClient: boolean, ...param) {
        if (!this.obj) {
            this.obj = await SpawnManager.asyncSpawn({ guid: this.guid, replicates: !isClient })
        }
        this.obj.setCollision(mw.PropertyStatus.On)
        this.obj.setVisibility(mw.PropertyStatus.On)
        this.isActive = true
    }

    public despawn() {
        this.obj.setCollision(mw.PropertyStatus.Off)
        this.obj.setVisibility(mw.PropertyStatus.Off)
        TimeUtil.delayExecute(() => {
            this.obj.worldTransform.position = despawnLocation;
        }, 3)
        this.isActive = false;
    }

    public destroy() {
        this.isActive = false;
        this.obj.destroy()
        this.obj = null;
    }
}
const despawnLocation = new mw.Vector(9999, 9999, 9999)
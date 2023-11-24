/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-25 16:40:46
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-08 13:14:41
 * @FilePath     : \magicmanor\JavaScripts\modules\building\BuildingData.ts
 * @Description  : 
 */

export enum BuildingType {
    /**后庭 */
    BackPorch = 1,
    /**中庭 */
    Atrium,
    /**休憩亭 */
    RestPavilion,
    /**走廊 */
    Corridor,
    /**水域 */
    Pond
}

export default class BuildingData extends Subdata {
    /**已解锁建筑 */
    @Decorator.persistence()
    public lockBuildings: number[] = [];
    /**装饰的建筑 */
    @Decorator.persistence()
    public equipBuildings: number[] = []
    /**庄园等级 */
    @Decorator.persistence()
    public manorLevel: number = 0;

    protected initDefaultData(): void {
        this.lockBuildings = [];
        this.equipBuildings = [];
        this.manorLevel = 0;
        this.save(false);
    }

    protected onDataInit(): void {
        this.toTargetVersion();
    }

    protected toTargetVersion() {
        if (this.currentVersion === this.version) return;
        console.log(`update version: ${this.currentVersion} to version: ${this.version}`);
        switch (this.currentVersion) {
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
        this.currentVersion = this.version;
        this.save(false);
    }

    public addManorLevel() {
        this.manorLevel++;
        /**庄园最大等级为5 */
        if (this.manorLevel > 5) {
            this.manorLevel = 5;
        }
        this.save(false);
    }

    public addBuilding(id: number) {
        if (this.lockBuildings.includes(id)) {
            console.error("已解锁该建筑： " + id);
            return;
        }
        this.lockBuildings.push(id);
        this.save(false);
    }

    public subBuilding(id: number) {
        const index = this.lockBuildings.indexOf(id);
        if (index !== -1) {
            this.lockBuildings.splice(index, 1);
        }
        this.save(false);
    }

    public loadBuilding(id: number) {
        if (this.equipBuildings.includes(id)) {
            console.error("场景已存在该建筑： " + id);
            return;
        }
        this.equipBuildings.push(id);
        this.save(false);
    }

    public unloadBuilding(id: number) {
        const index = this.equipBuildings.indexOf(id);
        if (index !== -1) {
            this.equipBuildings.splice(index, 1);
        }
        this.save(false);
    }

    public clearEquipBuildings() {
        this.equipBuildings = [];
        this.save(false);
    }
}
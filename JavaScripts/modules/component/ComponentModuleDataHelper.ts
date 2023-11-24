

/**
 * 怪物信息
 */
 export class MonsterSyncGame {
	tags: string[]=[];
	guid: string[]=[];
	configId: number[]=[];
	hp: number[]=[];
}
/**
 * Component模块数据helper类
 */
export class ComponentModuleDataHelper extends Subdata{

    /**
     * 初始化默认数据
     */
    protected override initDefaultData() {
        super.initDefaultData();

    }
    /**
     * 数据初始化完成调用
     */
    protected override onDataInit(): void {
        super.onDataInit();
        this.toTargetVersion();
    }

    /**
     * 目标版本,升级版本请重写
     */
    protected get version(): number {
        return 1;
    }

    /**
     * 将老版本升级到新版本
     */
    protected toTargetVersion() {
        if (this.version === this.currentVersion) return;
        console.log(`update version: ${ this.currentVersion } to targetVersion: ${ this.version }`);
        switch (this.version) {
            case 1:
        }
        this.currentVersion = this.version;
    }


}

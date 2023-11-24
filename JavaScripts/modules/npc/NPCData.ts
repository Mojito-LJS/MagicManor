
type NPCInfo = { id: number, Rewards: number[] }

export class NPCDataHelper extends Subdata {
    @Decorator.persistence()
    public infoArray: NPCInfo[] = []

    protected override get version() {
        return 1
    }

    protected initDefaultData(): void {
        this.infoArray = [];
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
}

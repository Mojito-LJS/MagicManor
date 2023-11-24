export class ModuleBaseC {
    protected get localPlayer(): mw.Player {
        return this.moduleC["localPlayer"]
    }
    protected get localPlayerId(): number {
        return this.moduleC["localPlayerId"]
    }
    constructor(protected moduleC: ModuleC<any, any>) {
        this.onStart()
    }
    protected onStart() {

    }
    public onEnterScene(sceneType: number) {

    }
}

export class ModuleBaseS {
    constructor(protected moduleC: ModuleS<any, any>) {
        this.onStart()
    }
    protected onStart() {

    }

    public onPlayerEnterGame(player: mw.Player) {

    }

    public onPlayerLeft(player: mw.Player): void {

    }
}
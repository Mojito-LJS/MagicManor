import PlayerModuleClient from "../modules/player/PlayerModuleClient"
import PlayerModuleServer from "../modules/player/PlayerModuleServer"

export class GlobalModule {

    static get MyPlayerC() {
        return ModuleService.getModule(PlayerModuleClient)
    }

    static get MyPlayerS() {
        return ModuleService.getModule(PlayerModuleServer)
    }

}
export default class ScriptBase extends mw.Script {
	protected static instance: ScriptBase;

	static client(player: mw.Player, guid: string) { }

	static clientAll(guid: string) { }

	static server(guid: string) { }

	@mw.RemoteFunction(mw.Client)
	private client(player: mw.Player, guid: string) { }
	@mw.RemoteFunction(mw.Client, mw.Multicast)
	private clientAll(guid: string) { }
	@mw.RemoteFunction(mw.Server)
	private server(guid: string) { }
}

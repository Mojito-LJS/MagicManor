import { getNetWorkC, regNetworkC } from "../../base/NetworkManager";

export enum BuffNameC {
	test = "test",
}
@regNetworkC()
class BuffNetworkC {
	tt = 1;
	test(...args) {
		console.log("test--->S---->", SystemUtil.isServer());
	}
}

export const buffNetworkC = getNetWorkC<BuffNetworkC, BuffNameC>(BuffNetworkC);

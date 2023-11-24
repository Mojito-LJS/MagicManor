import { getNetWorkS, regNetworkS } from "../../base/NetworkManager";

export enum BuffNameS {
	test = "test",
}
@regNetworkS()
class BuffNetworkS {
	tt = 1;
	test(...args) {
		console.log("test--->S---->", SystemUtil.isServer());
	}
}

export const buffNetworkS = getNetWorkS<BuffNetworkS, BuffNameS>(BuffNetworkS);

let tag = "[ DEBUG--LOG--> ]  [";
if (SystemUtil.isServer() && SystemUtil.isClient()) {
	tag += "-S&C-";
} else if (SystemUtil.isServer()) {
	tag += "-S-";
} else {
	tag += "-C-";
}
tag += "]:   ";
global.logLevel = 0;
global.logI = (...args: unknown[]) => {
	if (logLevel > 0) {
		return;
	}
	console.log("[ Info ] - ", tag, ...args);
};

global.logW = (...args: unknown[]) => {
	if (logLevel > 1) {
		return;
	}
	console.warn("[ Warn ] - ", tag, ...args);
};

global.logE = (...args: unknown[]) => {
	if (logLevel > 2) {
		return;
	}
	console.error("[ Error ] - ", tag, ...args);
};

global.now = () => {
	return Date.now();
};

Math.clamp = (v: number, min: number, max: number) => {
	return Math.max(min, Math.min(max, v));
};

Math.radian = (v: number) => {
	return v * MathUtil.D2R; // Math.PI / Angle
};

Math.angle = (v: number) => {
	return v * MathUtil.R2D; // Angle / Math.PI
};

Math.isFinite = (v: number) => {
	return Math.abs(v) < Infinity;
};

global.wait = (v: number) => {
	return new Promise<void>((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, v);
	});
};
Object.defineProperty(mw.Image.prototype, "setImageByURL", {
	value: function (inURL: string) {
		// if (inURL.indexOf("meta-verse.co/Content") >= 0) {
		this.get().SetImageByURL(inURL);
		// } else {
		//   require("MWLibConsole").warn("The current URL does not conform to the rules. Please check the connection and try again!");
		// }
	}
});

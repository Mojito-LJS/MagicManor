declare module "ue";
declare module "puerts";
declare var global;
/**
 * 使用info等级输出日志
 * @param args
 */
declare function logI(...args: any[]): void;
/**
 * 警告信息
 * @param args
 */
declare function logW(...args: any[]): void;
/**
 * 错误信息
 * @param args
 */
declare function logE(...args: any[]): void;

/**
 * 异步等待
 * @param duration 等待时间
 */
declare function wait(duration: number): Promise<void>;

/**
 * 获取当前时间
 */
declare function now(): number;

//多语言 预留接口
// eslint-disable-next-line @typescript-eslint/naming-convention
declare function T(key: string, ...args: any[]): string;

/**
 * 日志等级
 */
declare var logLevel: number;

interface Math {
	clamp(v: number, min: number, max: number): number;

	radian(v: number): number;

	angle(v: number): number;

	isFinite(v: number): boolean;
}

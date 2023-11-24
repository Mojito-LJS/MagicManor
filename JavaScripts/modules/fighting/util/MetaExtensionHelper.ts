namespace MathUtil {
    /**
     * 判断一个值是否在俩值之间
     * @param a
     * @param min
     * @param max
     * @returns
     */
    export function comparison(a: number, min: number, max: number): boolean {
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        return a >= min && a <= max;
    }
}
namespace Util {
    /**
     * 模块工具
     */
    export namespace ModuleUtil {
        class Module {
            client: TypeName<ModuleC<any, any>> = null;

            server: TypeName<ModuleS<any, any>> = null;

            data: TypeName<Subdata> = null;
        }

        const _map: Map<number, Module> = new Map();

        function getModule(name: number) {
            if (_map.has(name)) {
                return _map.get(name);
            } else {
                const module = new Module();
                _map.set(name, module);
                return module;
            }
        }

        function addClient(name: number, client: TypeName<ModuleC<any, any>>) {
            getModule(name).client = client;
        }

        function addServer(name: number, server: TypeName<ModuleS<any, any>>, data: TypeName<Subdata>) {
            const module = getModule(name);
            module.server = server;
            module.data = data;
        }

        /**注册单个模块 */
        function register(ServerModule: TypeName<ModuleS<any, any>>, ClientModule: TypeName<ModuleC<any, any>>, ModuleDataClass: TypeName<Subdata>) {
            console.log("register_module_", ServerModule.name, ClientModule.name, ModuleDataClass?.name);
            ModuleService.registerModule(ServerModule, ClientModule, ModuleDataClass);
        }
        /**
         * 注册一个客户端模块
         * @param moduleId
         * @returns
         */
        export function client<C extends ModuleC<ModuleS<C, Subdata>, Subdata>>(moduleId: number) {
            return function (constructor: TypeName<C>) {
                addClient(moduleId, constructor);
            };
        }
        /**
         * 注册一个服务端模块
         * @param moduleId
         * @returns
         */
        export function server<D extends Subdata, S extends ModuleS<ModuleC<S, D>, D>>(moduleId: number, data: TypeName<D>) {
            return function (constructor: TypeName<S>) {
                addServer(moduleId, constructor, data);
            };
        }
        /**注册模块 */
        export function registerModule() {
            _map.forEach((v) => {
                register(v.server, v.client, v.data);
            });
        }
    }
}

// namespace Type {
/**
 * 类型工具拓展
 */
export class TypeUtil {
    /**
     * 线性插值
     * @param from 初始位置
     * @param to 目标位置
     * @param t 插值
     * @param generator 生成返回值对象
     * @returns result
     */
    static typeLerp<V extends { [key: string]: number }>(from: V, to: V, t: number, generator: new () => V) {
        let result = new generator();
        for (var k in result) {
            let value0 = from[k] as unknown as number;
            let value1 = to[k] as unknown as number;
            if (null != value0 && null != value1) {
                (result as any)[k] = value0 + (value1 - value0) * t;
            }
        }
        return result;
    }
}
/**
 * Vector工具拓展
 */
export class VectorUtil {
    /**
     * 数组转vector
     * @param arr
     * @returns
     */
    static arr3Vec3(arr: number[]) {
        if (arr == null || arr.length != 3) {
            return null;
        }
        let vec = new Vector(arr[0], arr[1], arr[2]);
        return vec;
    }
    /**
     * 数组转Rotation
     * @param arr
     * @returns
     */
    static arr3Rot3(arr: number[]) {
        if (arr == null || arr.length != 3) {
            return null;
        }
        let vec = new Rotation(arr[0], arr[1], arr[2]);
        return vec;
    }
    /**
     * Vector转数组
     * @param vec
     * @returns
     */
    static vec3Arr(vec: Vector) {
        return [vec.x, vec.y, vec.z];
    }

    /**
     * 获取圆形上随机位置
     * @param center
     * @param radius
     * @returns
     */
    static getCircleRandomPos(center: Vector, radius: number, other?: Vector): Vector {
        other = other || new Vector(center.x, center.y, center.z);
        let angle = Math.random() * 360;
        other.x = center.x + Math.sin((angle * Math.PI) / 180) * radius;
        other.y = center.y + Math.cos((angle * Math.PI) / 180) * radius;
        return other;
    }

    static getLinePos(start: Vector, end: Vector, radius: number, other?: Vector): Vector {
        if (radius == 0) {
            return end;
        }
        other = Vector.subtract(end, start, other);
        let size = other.length;
        if (size <= radius) {
            return start;
        }
        other = other.normalize();
        return other.multiply(size - radius).add(start);
    }
    /**
     * 3d 贝塞尔曲线
     * @param p0
     * @param p1
     * @param p2
     * @param t
     * @returns
     */
    static getBirther3d(p0: Vector, p1: Vector, p2: Vector, t: number, other?: Vector) {
        let x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
        let z = (1 - t) * (1 - t) * p0.z + 2 * t * (1 - t) * p1.z + t * t * p2.z;
        if (other) {
            return other.set(x, y, z);
        }
        return new Vector(x, y, z);
    }
    /**
     * 2d 贝塞尔曲线
     * @param p0
     * @param p1
     * @param p2
     * @param t
     * @returns
     */
    static getBirther2d(p0: Vector2, p1: Vector2, p2: Vector2, t: number) {
        let x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;

        return new Vector2(x, y);
    }

    /**
     * 依轴过滤向量,只保留绝对值最大的值
     * @param vector 向量
     * @returns 轴向量
     */
    public static getAxisAbsMax<V>(vector: V) {
        let axis = "";
        let value = 0;
        for (let k in vector) {
            let compv: number = +vector[k];
            if (Number.isNaN(compv)) {
                continue;
            }
            if (Math.abs(compv) > Math.abs(value)) {
                axis = k;
                value = compv;
            }
        }
        return { axis: axis, value: value };
    }

    /**
     * 判断2维向量是否在矩形范围内
     * @param min 矩形向量中最小的点
     * @param max 矩形向量中最大的点
     * @param pos 被判断的点
     * @returns 以两点作为边界值的比较
     */
    public static withinRect(min: Vector2, max: Vector2, pos: Vector2) {
        return pos.x >= min.x && pos.x <= max.x && pos.y >= min.y && pos.y <= max.y;
    }
}
// }
export { MathUtil, Util };

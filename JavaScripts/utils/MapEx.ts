/**
 * MapEx(可序列化)
 */
export namespace MapEx {

    export type MapExClass<T> = {
        [key: string | number]: T
    }

    /**
     * 是否为空
     * @param map 
     * @returns 是/否 
     */
    export function isNull<T>(map: MapExClass<T>): boolean {
        return !map || map == null || map == undefined;
    }

    /**
     * 获取对象
     * @param map 
     * @param key 
     * @returns 
     */
    export function get<T>(map: MapExClass<T>, key: string | number): T {

        if (map[key]) {
            return map[key];
        }

        let has = false;
        const keys = Object.keys(map)

        for (let i = 0; i < keys.length; ++i) {
            if (keys[i] == key) {
                has = true;
                break;
            }
        }

        if (has) {
            return map[key];
        }
        return null;

    }

    /**
     * 设置对象
     * @param map 
     * @param key 
     * @param val 
     */
    export function set<T>(map: MapExClass<T>, key: string | number, val: T) {
        map[key] = val;

    }

    /**
     * 删除对象
     * @param map 
     * @param key 
     * @returns 成功/失败
     */
    export function del<T>(map: MapExClass<T>, key: string | number): boolean {

        if (map[key]) {
            delete map[key];
            return true;
        }

        let has = false;
        const keys = Object.keys(map)

        for (let i = 0; i < keys.length; ++i) {
            if (keys[i] == key) {
                has = true;
                break;
            }
        }

        if (has) {
            delete map[key];
            return true;
        }
        return false;
    }

    /**
     * 是否有指定对象
     * @param map 
     * @param key 
     * @returns 
     */
    export function has<T>(map: MapExClass<T>, key: string | number): boolean {
        if (map[key]) {
            return true;
        }

        let has = false;
        const keys = Object.keys(map)

        for (let i = 0; i < keys.length; ++i) {
            if (keys[i] == key) {
                has = true;
                break;
            }
        }

        if (has) {
            return true;
        }
        return false;
    }

    /**
     * 获取count数量
     * @param map 
     * @param key 
     * @returns 
     */
    export function count<T>(map: MapExClass<T>): number {
        let res = 0;
        forEach(map, e => {
            ++res;
        })
        return res;
    }

    /**
     * 遍历map
     * @param map 
     * @param callback 
     */
    export function forEach<T>(map: MapExClass<T>, callback: (key: string | number, element: T) => void) {
        for (const key in map) {
            if (map[key]) {
                callback(key, map[key]);
            }
        }
    }

    /**
     * 拷贝，Val还是引用出来的，只是Map换了
     * @param map 
     * @returns 
     */
    export function copy<T>(map: MapExClass<T>): MapExClass<T> {
        const res = {};
        for (const key in map) {
            res[key] = map[key];
        }
        return res;
    }
}
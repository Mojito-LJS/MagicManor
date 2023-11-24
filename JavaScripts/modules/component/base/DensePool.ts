/**
 * @Author       : 陈佩文 peiwen.chen@appshahe.com
 * @Date         : 2023-02-21 10:31:31
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-05 10:02:39
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\logic\corebattle\base\DensePool.ts
 * @Description  :
 */
class PoolObject<T> {
    public free: boolean = false;

    constructor(public readonly data: T, public nextFree: PoolObject<T> = null, public previousFree: PoolObject<T> = null) { }
}

type ObjCreator<T> = () => T;

type ObjResetter<T> = (source: T) => boolean;

interface SignableObject {
    ___recover_Pool: PoolObject<unknown>;
}

export class DensePool<T> {
    private _pool: PoolObject<T>[];

    private lastFree: PoolObject<T>;

    private nextFree: PoolObject<T>;

    public cacheRatio: number = 0;

    private query: number = 0;

    private cache: number = 0;

    constructor(readonly objCreator: ObjCreator<T>, readonly objResetter: ObjResetter<T>, initialSize = 5000) {
        this._pool = [];
        this.objCreator = objCreator;
        this.objResetter = objResetter;
        for (let i = 0; i < initialSize; i++) {
            this.addNewObject(this.newPoolObject());
        }
    }

    release(poolData: T) {
        const signable = poolData as unknown as SignableObject;
        if (!signable.___recover_Pool) {
            return;
        }

        const poolObject = signable.___recover_Pool as PoolObject<T>;
        delete signable.___recover_Pool;
        this.innerRelease(poolObject);
    }

    canRecover(poolData: Object) {
        return "___recover_Pool" in poolData;
    }

    spawn(): T {
        let freeObject: PoolObject<T>;
        this.query++;
        if (this.nextFree) {
            freeObject = this.nextFree;
            this.cache++;
        } else {
            freeObject = this.addNewObject(this.newPoolObject());
        }
        // 计算命中率
        this.cacheRatio = this.cache / this.query;

        freeObject.free = false;

        this.nextFree = freeObject.nextFree;

        if (!this.nextFree) this.lastFree = null;

        const ret = freeObject.data as unknown as SignableObject;
        ret.___recover_Pool = freeObject;
        return ret as unknown as T;
    }

    releaseAll() {
        const pool = this._pool;
        for (const obj of pool) {
            this.innerRelease(obj);
        }
        this._pool.length = 0;
    }

    private addNewObject(obj: PoolObject<T>) {
        this._pool.push(obj);
        this.innerRelease(obj);
        return obj;
    }

    private newPoolObject() {
        const object = this.objCreator();
        return new PoolObject(object, this.lastFree, this.nextFree);
    }

    private innerRelease(poolObject: PoolObject<T>) {
        poolObject.free = true;

        poolObject.nextFree = null;
        poolObject.previousFree = this.lastFree;

        if (poolObject.previousFree) {
            this.lastFree.nextFree = poolObject;
        } else {
            this.nextFree = poolObject;
        }

        this.lastFree = poolObject;

        this.objResetter(poolObject.data);
    }
}

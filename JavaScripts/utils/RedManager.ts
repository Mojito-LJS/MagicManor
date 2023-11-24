
class Link {
    constructor(public preNode: number, public redPointUI: mw.Image, public value: number = 0) {
    }
}

export default class RedManager {
    private static _instance: RedManager;

    public static get instance(): RedManager {
        if (!RedManager._instance) {
            RedManager._instance = new RedManager();
        }
        return RedManager._instance;
    }

    /**用来存储树名及对应的节点信息 */
    public treeMap: Map<string, Map<number, Link>> = new Map();

    /**
     * 创建一棵树
     * @param treeName 树名 
     * @param redPointUI 根节点的红点的UI图片
     */
    public createTree(treeName: string, redPointUI: mw.Image) {
        this.treeMap.set(treeName, new Map());
        //根节点  根节点的父节点
        this.insertNode(treeName, 0, -1, redPointUI);
    }

    /**
     * 插入树的节点
     * @param curNode 
     * @param preNode 父节点编号（根节点编号为0）
     * @param redPointUI 
     */
    public insertNode(treeName: string, curNode: number, preNode: number, redPointUI: mw.Image) {
        if (!this.treeMap.has(treeName)) {
            return;
        }
        //获得树
        const tree = this.treeMap.get(treeName)
        //设置节点信息
        const treeNode = new Link(preNode, redPointUI);
        tree.set(curNode, treeNode);
    }

    /**
     * 删除节点（只能时叶子节点）
     * @param treeName 被删除节点的树名 
     * @param curNode 被删除的节点
     * @returns 
     */
    public deleteNode(treeName: string, curNode: number) {
        if (!this.treeMap.has(treeName)) {
            return;
        }
        const tree = this.treeMap.get(treeName)
        //遍历map
        for (const [id, node] of tree) {
            if (node.preNode === curNode) {
                console.log(`删除的节点不是叶子节点`);
                return;
            }
        }
        this.changeRedPointCondition(treeName, curNode, false);
        tree.delete(curNode);
    }

    /**
     * 改变红点状态，会递归调用改变所有父节点状态
     * @param curNode 当前节点编号
     * @param isVisible 当前节点显示还是隐藏
     * @param callBack 隐藏或显示当前红点的方法
     */
    public changeRedPointCondition(treeName: string, curNode: number, isVisible: boolean) {
        if (!this.treeMap.has(treeName)) {
            return;
        }
        const tree = this.treeMap.get(treeName)
        //遍历该树的信息
        for (const [id, node] of tree) {
            if (node.preNode === curNode) {
                console.log(`修改的节点不是叶子节点`);
                return;
            }
        }
        if (!tree.has(curNode)) {
            console.error("错误红点树内尚无该节点");
            return;
        }

        //显隐相同则无需修改
        if (isVisible === tree.get(curNode).redPointUI.visible) {
            return;
        }
        const value = isVisible === true ? 1 : -1;
        //递归修改所有父节点
        this.recursionPar(treeName, curNode, value);
    }

    /**
     * 对父节点进行递归
     * @param curNode 
     * @param value 
     * @returns 
     */
    private recursionPar(treeName: string, curNode: number, value: number) {
        if (!this.treeMap.has(treeName)) {
            return;
        }
        const tree = this.treeMap.get(treeName);
        //计算当前节点以及以下子节点的红点树判断显隐
        this.claValue(treeName, curNode, value);
        //到根节点了
        if (curNode === 0) {
            return;
        }
        this.recursionPar(treeName, tree.get(curNode).preNode, value);
    }

    /**
     * 判断当前节点是否符合显隐条件
     * @param curNode 
     * @param value 
     */
    private claValue(treeName: string, curNode: number, value: number) {
        if (!this.treeMap.has(treeName)) {
            return;
        }
        const tree = this.treeMap.get(treeName);
        tree.get(curNode).value += value;
        if (tree.get(curNode).value > 0) {
            tree.get(curNode).redPointUI.visibility = mw.SlateVisibility.Visible;
        } else {
            tree.get(curNode).redPointUI.visibility = mw.SlateVisibility.Hidden;
        }
        console.log("当前节点" + curNode + "value is " + tree.get(curNode).value);
    }
}
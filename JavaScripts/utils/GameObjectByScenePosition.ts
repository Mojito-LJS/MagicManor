/* eslint-disable @typescript-eslint/naming-convention */


export class GameObjectByScenePosition {
	public static toArray(arr) {
		const newArr = [];
		for (let index = 0; index < arr.Num(); index++) {
			newArr.push(arr.Get(index));
		}
		return newArr;
	}

	static get(x, y, distance = 1e5, multiTrace = false, onRay = false) {
		// 转换点击的屏幕坐标为3D世界坐标
		const pos = InputUtil.convertScreenLocationToWorldSpace(x, y);

		// 获得点击位置前方方向
		const forV = pos.worldDirection;

		// 计算点击位置朝向一定距离的终点位置
		const endPos = pos.worldPosition.clone().add(forV.multiply(distance));

		const hitInfo = QueryUtil.lineTrace(pos.worldPosition, endPos, multiTrace, onRay);
		const newRes: mw.HitResult[] = [];
		hitInfo.forEach((e) => {
			if (e.gameObject instanceof mw.Pawn) {
				console.log("e.gameObject instanceof mw.Pawn");
			} else {
				newRes.push(e);
			}
		});
		return newRes;
	}
}

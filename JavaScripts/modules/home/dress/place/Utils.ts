import { GeneralManager, } from '../../../../Modified027Editor/ModifiedStaticAPI';
import { ModifiedCameraSystem, CameraModifid, CameraSystemData, } from '../../../../Modified027Editor/ModifiedCamera';
import { IHomeDressElement } from "../../../../config/HomeDress";
import { GameObjectByScenePosition } from "../../../../utils/GameObjectByScenePosition";
import { Common } from "./Common";
const dirMax = 0.9;

const ceil = 25;
export class DressUtils {
	/**
	 * 根据屏幕坐标判断是否能放置装饰对象
	 * @param tempPos 屏幕坐标
	 * @param cfg 装饰配置
	 * @returns
	 */
	public static tryPushByScreenPos(tempPos: Vector2, cfg: IHomeDressElement, checkTouch: number): boolean {
		const self = Common.Instance;

		let hitRes = GameObjectByScenePosition.get(tempPos.x, tempPos.y, 1000, true, false);

		//解决touch导致旋转和装修拖拽冲突的问题。
		if (checkTouch === 0) {
			logI("checkTouch === 0");
		} else {
			if (self.touchState === 1) {
				//按下
				if (hitRes.findIndex((e) => e.gameObject === self.installViewGo) !== -1) {
					if (!self.cameraLock) {
						self.cameraLock = true;
						ModifiedCameraSystem.setOverrideCameraRotation(Camera.currentCamera.worldTransform.rotation);
					}
					self.isChoose = true;
				}
			} else if (self.touchState === 2) {
				logI("checkTouch === 2");
			} else if (self.touchState === 3) {
				//放开
				if (self.cameraLock) {
					self.cameraLock = false;
					ModifiedCameraSystem.resetOverrideCameraRotation();
				}
				self.isChoose = false;
			}
			if (!self.isChoose) {
				return;
			}
		}

		hitRes = hitRes.filter((e) => e.gameObject.tag === "area");

		if (hitRes.length > 0 && hitRes[0].gameObject.name === cfg.installArea) {
			const normalDir = hitRes[0].impactNormal.clone();

			if (self.areaNormalDir === null || Vector.distance(self.areaNormalDir, normalDir) > 0.1) {
				if (normalDir.z === -1) {
					normalDir.y = 0.01;
				} else if (normalDir.z === 1) {
					normalDir.y = 0.01;
				}

				const qua = self.installRootGo.worldTransform.rotation.toQuaternion();
				const qua2 = normalDir.toRotation().toQuaternion();
				const quares = new Quaternion();
				Quaternion.lerp(qua, qua2, 1, quares);

				self.installRootGo.worldTransform.rotation = quares.toRotation();

				if (self.rotateVal !== 0) {
					let quaternion = self.installRootGo.worldTransform.rotation.toQuaternion();
					quaternion = Quaternion.rotateAround(quaternion, self.installRootGo.worldTransform.getForwardVector(), self.rotateVal * MathUtil.D2R);
					self.installRootGo.worldTransform.rotation = quaternion.toRotation();
				}

				self.areaNormalDir = normalDir.clone();
			}

			const impactPoint = hitRes[0].impactPoint.clone();
			if (Math.abs(normalDir.x) < dirMax) impactPoint.x = Math.ceil(impactPoint.x / ceil) * ceil;
			if (Math.abs(normalDir.y) < dirMax) impactPoint.y = Math.ceil(impactPoint.y / ceil) * ceil;
			if (Math.abs(normalDir.z) < dirMax) impactPoint.z = Math.ceil(impactPoint.z / ceil) * ceil;
			self.installRootGo.worldTransform.position = impactPoint;

			self.importPoint = impactPoint.clone();

			if (!this.canPushLogic(self.areaNormalDir, impactPoint)) {
				self.installRootGo.worldTransform.position = self.installRootGo.worldTransform.position.add(
					self.installRootGo.worldTransform.position.subtract(self.installRootGo.getChildByName("point").worldTransform.position)
				);
				self.installOperUIWidget.worldTransform.position = self.installRootGo.worldTransform.position;
				this.setOperTipsInfo(false, self.areaNormalDir);
				return false;
			}

			self.installRootGo.worldTransform.position = self.installRootGo.worldTransform.position.add(
				self.installRootGo.worldTransform.position.subtract(self.installRootGo.getChildByName("point").worldTransform.position)
			);
			self.installOperUIWidget.worldTransform.position = self.installRootGo.worldTransform.position;
			this.setOperTipsInfo(true, self.areaNormalDir);
			return true;
		}

		return false;
	}

	/**
	 * 可放置计算
	 * @param normalDir 法线方向
	 * @param impactPoint 碰撞点
	 * @param impactNormal 法线方向
	 * @param cfg
	 * @returns
	 */
	public static canPushLogic(normalDir: Vector, impactPoint: Vector): boolean {
		const self = Common.Instance;
		const center = Vector.zero;
		const rect = Vector.zero;
		const impactNormal = normalDir;
		let list: HitResult[] = [];
		self.installViewGo.getBounds(true, center, rect, true);

		let rectX = 0;
		let rectY = 0;
		let forwardVector = Vector.zero;
		let rightVector = Vector.zero;
		let rectHigh = 0;
		if (Math.abs(normalDir.x) >= dirMax) {
			rectX = rect.y;
			rectY = rect.z;
			rectHigh = rect.x;
			forwardVector = self.installViewGo.worldTransform.getForwardVector();
			rightVector = self.installViewGo.worldTransform.getRightVector();
		} else if (Math.abs(normalDir.y) >= dirMax) {
			rectX = rect.x;
			rectY = rect.z;
			rectHigh = rect.y;
			forwardVector = self.installViewGo.worldTransform.getRightVector();
			rightVector = self.installViewGo.worldTransform.getForwardVector();
		} else if (Math.abs(normalDir.z) >= dirMax) {
			rectX = rect.x;
			rectY = rect.y;
			rectHigh = rect.z;
			forwardVector = self.installViewGo.worldTransform.getForwardVector();
			rightVector = self.installViewGo.worldTransform.getRightVector();
		}

		if ((self.rotateVal / 90) % 2 === 1) {
			const temp = forwardVector;
			forwardVector = rightVector;
			rightVector = temp;
		}

		logI("XY : ", rectX, rectY);
		logI("forwardVector-->toString----->", forwardVector.x.toFixed(2), forwardVector.y.toFixed(2), forwardVector.z.toFixed(2));
		logI("forwardVector-->toString----->", rightVector.x.toFixed(2), rightVector.y.toFixed(2), rightVector.z.toFixed(2));

		let tempstart = null;
		let temp = impactPoint.clone();

		temp = temp.subtract(rightVector.clone().multiply(rectX - 1));
		temp = temp.add(forwardVector.clone().multiply(rectY - 1));

		tempstart = temp.clone().add(impactNormal.clone().multiply(200));
		logI("tempstart 1 : " + tempstart);
		list = QueryUtil.lineTrace(tempstart, temp.subtract(impactNormal.clone().multiply(10)), true, false);
		if (list.findIndex((e) => e.gameObject.name === self.installCfg.installArea) === -1) {
			return false;
		}

		temp = impactPoint.clone();

		temp = temp.add(rightVector.clone().multiply(rectX - 1));
		temp = temp.subtract(forwardVector.clone().multiply(rectY - 1));

		tempstart = temp.clone().add(impactNormal.clone().multiply(200));
		// logI("tempstart 2 : " + tempstart);
		list = QueryUtil.lineTrace(tempstart, temp.subtract(impactNormal.clone().multiply(10)), true, false);
		if (list.findIndex((e) => e.gameObject.name === self.installCfg.installArea) === -1) {
			return false;
		}

		temp = impactPoint.clone();

		temp = temp.add(rightVector.clone().multiply(rectX - 1));
		temp = temp.add(forwardVector.clone().multiply(rectY - 1));

		tempstart = temp.clone().add(impactNormal.clone().multiply(200));
		// logI("tempstart 3 : " + tempstart);
		list = QueryUtil.lineTrace(tempstart, temp.subtract(impactNormal.clone().multiply(10)), true, false);
		if (list.findIndex((e) => e.gameObject.name === self.installCfg.installArea) === -1) {
			return false;
		}

		temp = impactPoint.clone();

		temp = temp.subtract(rightVector.clone().multiply(rectX - 1));
		temp = temp.subtract(forwardVector.clone().multiply(rectY - 1));

		tempstart = temp.clone().add(impactNormal.clone().multiply(200));
		// logI("tempstart 4 : " + tempstart);
		list = QueryUtil.lineTrace(tempstart, temp.subtract(impactNormal.clone().multiply(10)), true, false);
		if (list.findIndex((e) => e.gameObject.name === self.installCfg.installArea) === -1) {
			return false;
		}

		if (Math.abs(normalDir.x) >= dirMax || Math.abs(normalDir.y) >= dirMax) {
			const temp = rectX;
			rectX = rectY;
			rectY = temp;
		}

		temp = impactPoint.clone();
		let goList = GeneralManager.modiftboxOverlap(
			temp.clone(),
			temp.clone().add(impactNormal.clone().multiply(rectHigh * 1.9)),
			rectY * 1.9,
			rectX * 1.9,
			false,
			[],
			false,
			self.installViewGo
		);

		// 过滤 area
		// 筛选 view 并且不是自己的view
		// 自己view 下找不到的

		const res = [];
		goList.forEach((e) => {
			if (e.tag === "area") {
				return;
			}

			if (self.installViewGo.gameObjectId === e.gameObjectId) {
				return;
			}

			if (self.installViewGo.getChildByGameObjectId(e.gameObjectId) !== null) {
				return;
			}

			if (e.name !== "view") {
				return;
			}

			res.push(e);
		});

		goList = res;

		if (goList.length > 0) {
			return false;
		}

		return true;
	}

	/**
	 * 设置安装提示组件信息
	 * @param pushSucc 是否能安装成功
	 * @param normalDir 法线方向
	 */
	public static setOperTipsInfo(pushSucc: boolean, normalDir: Vector) {
		const self = Common.Instance;
		const size = Vector.zero;
		self.installViewGo.getBoundingBoxExtent(true, true, size);
		self.canInstall = pushSucc;
		//logI("size : " + size);

		let width = 0;
		let height = 0;
		if (Math.abs(normalDir.z) >= dirMax) {
			width = size.x;
			height = size.y;
		} else if (Math.abs(normalDir.x) >= dirMax) {
			width = size.y;
			height = size.z;
		} else if (Math.abs(normalDir.y) >= dirMax) {
			width = size.x;
			height = size.z;
		}

		const useValue = Math.max(width, height);

		const qua = self.operDressTips.worldTransform.rotation.toQuaternion();
		const qua2 = normalDir.toRotation().toQuaternion();
		const quares = new Quaternion();
		Quaternion.lerp(qua, qua2, 1, quares);

		self.operDressTips.worldTransform.rotation = quares.toRotation();
		self.operDressTips.worldTransform.position = self.installRootGo.getChildByName("point").worldTransform.position.clone();

		const cube = self.operDressTips.getChildByName("cube");
		cube.worldTransform.scale = new Vector(0.01, width / 100, height / 100);
		cube.localTransform.position = (new Vector(0, 0, -height / 2));

		self.operDressTips.getChildByName("leftArr").localTransform.position = (new Vector(0, useValue, 0)); // width + ceil
		self.operDressTips.getChildByName("rightArr").localTransform.position = (new Vector(0, -useValue, 0)); // -width - ceil
		self.operDressTips.getChildByName("downArr").localTransform.position = (new Vector(0, 0, -useValue)); // -height
		self.operDressTips.getChildByName("upArr").localTransform.position = (new Vector(0, 0, useValue)); // height

		//self.operDressTips.setVisibility(mw.PropertyStatus.On);

		self.operDressTips.getChildren().forEach((e) => {
			const staticMesh = e as mw.Model;
			staticMesh
				.getMaterialInstance()[0]
				.getAllVectorParameterName()
				.forEach((e2) => {
					staticMesh.getMaterialInstance()[0].setVectorParameterValue(e2, pushSucc ? LinearColor.green : LinearColor.red);
				});
		});
	}
}

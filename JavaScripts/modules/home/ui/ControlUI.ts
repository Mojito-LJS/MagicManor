import ControlUI_Generate from "../../../ui-generate/home/room/ControlUI_generate";

export class ControlUI extends ControlUI_Generate {
	// Touch
	protected cameraSystem: mw.Camera;

	protected targetArmLength: number;

	protected toucher: mw.TouchInput;

	protected touchNum = 0;

	protected doubleTouchDistance = 0;

	protected isUsedJoystick = false;

	protected onStart() {
		this.layer = mw.UILayerBottom;
		this.initUI();
	}

	protected initUI() {
		// #region Touch
		this.toucher = new mw.TouchInput();
		mw.Player.asyncGetLocalPlayer().then((player) => {
			this.cameraSystem = mw.Camera.currentCamera
			this.targetArmLength = this.cameraSystem.springArm.length;
		});

		this.virtualJoystickPanel.onJoyStickDown.add(() => {
			this.isUsedJoystick = true;
		});
		this.virtualJoystickPanel.onJoyStickUp.add(() => {
			this.isUsedJoystick = false;
		});

		this.toucher.onTouch.add((index: number, location: mw.Vector2, touchType: mw.TouchInputType) => {
			switch (touchType) {
				case mw.TouchInputType.TouchBegin:
					if (this.isUsedJoystick) return;
					this.touchNum = index + 1;
					if (this.touchNum == 2) {
						const touchVectorArray = this.toucher.getTouchVectorArray();
						this.doubleTouchDistance = Vector2.distance(touchVectorArray[0], touchVectorArray[1]);
						// 临时停用触摸与摇杆区
						this.virtualJoystickPanel.enable = false;
						this.touchPadDesigner.enable = false;
					}
					break;
				case mw.TouchInputType.TouchEnd:
					this.touchNum = index;
					if (this.touchNum < 2) {
						this.virtualJoystickPanel.enable = true;
						this.touchPadDesigner.enable = true;
					}
					break;
				case mw.TouchInputType.TouchMove:
					if (this.isUsedJoystick) return;
					if (this.touchNum == 2) {
						// 限制摄像机拉近拉远范围
						const touchVectorArray = this.toucher.getTouchVectorArray();
						const distance = Vector2.distance(touchVectorArray[0], touchVectorArray[1]);
						const delta = distance - this.doubleTouchDistance;
						this.targetArmLength -= delta;
						this.targetArmLength = MathUtil.clamp(this.targetArmLength, 100, 800);
						this.cameraSystem.springArm.length = this.targetArmLength;
						this.doubleTouchDistance = distance;
					}
				default:
					break;
			}
		});

		InputUtil.onKeyDown(Keys.MouseScrollDown, () => {
			this.targetArmLength += 10;
			this.targetArmLength = MathUtil.clamp(this.targetArmLength, 100, 2000);
			this.cameraSystem.springArm.length = this.targetArmLength;
		});
		InputUtil.onKeyDown(Keys.MouseScrollUp, () => {
			this.targetArmLength -= 10;
			this.targetArmLength = MathUtil.clamp(this.targetArmLength, 100, 2000);
			this.cameraSystem.springArm.length = this.targetArmLength;
		});
	}

	/** 摇杆启用/停用 */
	public setJoystickEnable(isEnable: boolean) {
		this.virtualJoystickPanel.enable = isEnable;
	}
}

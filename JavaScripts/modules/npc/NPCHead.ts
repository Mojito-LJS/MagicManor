import NPCHead_Generate from "../../ui-generate/uiTemplate/NPC/NPCHead_generate";
import { TaskSate } from "../task/TaskData";



export class NPCHead extends NPCHead_Generate {


	private time = 0;

	onStart() {
		this.chat.visibility = (mw.SlateVisibility.Hidden)
		this.mTaskState.visibility = mw.SlateVisibility.Collapsed;
	}

	public setName(name: string): void {
		this.nameTxt.text = (name);
	}

	refreshTaskState(state: TaskSate): void {
		this.mTaskState.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		if (state === TaskSate.Commit) {
			this.mTaskState.imageGuid = "175672"
		} else {
			this.mTaskState.imageGuid = "175671"
		}
	}

	/**头顶上显示文字 */
	public showText(text: string): void {
		this.text.text = text;
		this.chat.visibility = (mw.SlateVisibility.Visible);
		setTimeout(() => {
			this.chat.visibility = (mw.SlateVisibility.Hidden);
		}, 2000);
	}

	public onUpdate(dt: number): void {

	}
}
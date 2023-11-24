import ComponentSystem from "../../../base/ComponentSystem";
import { Aggregator } from "../../attribute/aggregator/Aggregator";
import BuffComponent from "../BuffComponent";
import { ActiveBuff } from "./ActiveBuff";

const MAX_BROADCAST_DIRTY = 10;
export class BuffAggregator extends Aggregator {
	public dependents: ActiveBuff[] = [];
	public override broadcastOnDirty() {
		if (this.broadcastingDirtyCount > MAX_BROADCAST_DIRTY) {
			this.onDirtyRecursive.call(this);
			return;
		}

		this.broadcastingDirtyCount++;
		this.onDirty.call(this);

		const dependentsLocalCopy = this.dependents.concat();
		this.dependents.length = 0;

		for (const handle of dependentsLocalCopy) {
			const effectComponent = ComponentSystem.getComponent(BuffComponent, handle.contextInfo.from);
			if (effectComponent && effectComponent.onMagnitudeDependencyChange(handle, this)) {
				this.dependents.push(handle);
			}
		}

		this.broadcastingDirtyCount--;
	}

	public override clear(): void {
		this.dependents.length = 0;
		super.clear();
	}
}

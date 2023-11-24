import { single } from "../../../utils/GameUtils";
import { BaseComponent } from "../../component/base/Component";
import ComponentSystem from "../../component/base/ComponentSystem";
import InfoComponent from "../../component/components/info/InfoComponent";
import { TagComponent } from "../../component/components/tag/TagComponent";
import { IdentifierTags } from "../../component/components/tag/core/IdentifierTags";
import { TagType } from "../../component/components/tag/core/TagsManager";

const myForwardVector = mw.Vector.zero;
@single()
export class FightManager {
	public static readonly instance: FightManager = null;
	/**
	 * 根据tag来获取战斗对象
	 * @param tag 标签
	 * @param type tag匹配类型
	 * @returns
	 */
	public getEntityByTag(tag: string | string[], type: TagType) {
		return ComponentSystem.getEntity().filter(entity => {
			const tagComponent = entity[TagComponent.name] as TagComponent;
			if (!tagComponent) {
				return false;
			}
			switch (type) {
				case TagType.All:
					return tagComponent.hasAll(tag);
				case TagType.AllExact:
					return tagComponent.hasAllExact(tag);
				case TagType.Any:
					return tagComponent.hasAny(tag);
				case TagType.AnyExact:
					return tagComponent.hasAnyExact(tag);
				default:
					return false;
			}
		});
	}
	public getEntityByEnemyToEntity(entity: string, tags: string[] = []): { [key: string]: BaseComponent }[] {
		const isMonster = ComponentSystem.getComponent(TagComponent, entity)?.hasAllExact(IdentifierTags.Monster.Normal);
		if (isMonster === undefined) {
			return;
		}
		// let enemyList: { [key: string]: BaseComponent }[] = [];
		if (isMonster) {
			tags.push(IdentifierTags.Player.Character);
			// enemyList = this.getEntityByTag(IdentifierTags.Player.Character, TagType.AllExact).filter(v => v[InfoComponent.name].ownerSign !== entity); // && v.tag.hasAllExact(IdentifierTags.State.Fighting)
		} else {
			tags.push(IdentifierTags.Monster.Normal);
			// enemyList =  //&& v.tag.hasAllExact(IdentifierTags.State.Fighting)
		}
		return this.getEntityByTag(tags, TagType.AllExact).filter(v => v[InfoComponent.name].ownerSign !== entity);
	}
	/**
	 * 获取敌对对象list
	 * @param entity 参照对象
	 * @returns
	 */
	public getEntityByEnemy(entity: string, guid: string): string;
	public getEntityByEnemy(entity: string): string[];
	public getEntityByEnemy(entity: string, guid?: string): string[] | string {
		const isMonster = ComponentSystem.getComponent(TagComponent, entity)?.hasAllExact(IdentifierTags.Monster.Normal);
		if (isMonster === undefined) {
			return;
		}
		let enemyList: string[] = this.getEntityByEnemyToEntity(entity).map(v => v[InfoComponent.name].ownerSign);
		if (guid) {
			return enemyList.find(v => v === guid);
		}
		return enemyList;
	}

	/**
	 * 获取敌对对象list
	 * @param entity 参照对象
	 * @returns
	 */
	public getEntityByEnemyByTag(entity: string): string[] {
		const tags = ComponentSystem.getComponent(TagComponent, entity).hasAnyExact(IdentifierTags.Monster.Normal)
			? IdentifierTags.Player.Character
			: IdentifierTags.Monster.Normal;
		// let enemyList: EntityC[] = []
		return this.getEntityByTag(tags, TagType.AnyExact).map(v => v[InfoComponent.name].ownerSign);
	}

	/**
	 * 获取最近的敌对对象
	 * @param entity 参照对象
	 * @returns
	 */
	public getEntityByEnemyOfLate(entity: string) {
		const info = ComponentSystem.getComponent(InfoComponent, entity);
		const my = info.owner.worldTransform.position;
		const enemyList = this.getEntityByEnemy(entity).sort(
			(a, b) =>
				mw.Vector.squaredDistance(ComponentSystem.getComponent(InfoComponent, a).owner.worldTransform.position, my) -
				mw.Vector.squaredDistance(ComponentSystem.getComponent(InfoComponent, b).owner.worldTransform.position, my)
		);
		if (enemyList.length > 0) {
			return enemyList[0];
		}
		return null;
	}

	/**
	 *
	 * 获取附近的敌对对象
	 * @param entity 参照对象
	 * @param scope 范围
	 * @returns
	 */
	public getEntityByEnemyOfScope(entity: string, scope: number) {
		const info = ComponentSystem.getComponent(InfoComponent, entity);
		const my = info.owner.worldTransform.position;
		const squaredScope = scope * scope;
		const enemyList = this.getEntityByEnemyToEntity(entity, [IdentifierTags.State.Fighting])
			.filter(a => mw.Vector.squaredDistance((a[InfoComponent.name] as InfoComponent).owner.worldTransform.position, my) < squaredScope)
			.sort(
				(a, b) =>
					mw.Vector.squaredDistance((a[InfoComponent.name] as InfoComponent).owner.worldTransform.position, my) -
					mw.Vector.squaredDistance((b[InfoComponent.name] as InfoComponent).owner.worldTransform.position, my)
			);
		if (enemyList.length > 0) {
			return enemyList;
		}
		return [];
	}
	public getEntityByEnemyAtMy(entity: string, scope: number) {
		const owner = ComponentSystem.getComponent(InfoComponent, entity);
		const my = owner.owner.worldTransform.position;
		// scope /= 2;
		const myc = owner.owner as mw.Character;
		let enemyList: InfoComponent[] = this.getEntityByEnemyToEntity(entity, [IdentifierTags.State.Fighting])
			.map(v => v[InfoComponent.name] as InfoComponent)
			.filter(e => {
				const loc = e.owner.worldTransform.position;
				myForwardVector.set(myc.worldTransform.getForwardVector());
				loc.subtract(my); //.normalize();
				const a = mw.Vector.angle3D(loc, myForwardVector);
				const l = loc.length;
				// if (l <= 5000) {
				// 	return false;
				// }
				const d = loc.length * Math.sin(a * MathUtil.D2R);
				// return a <= scope; //&& e.tag.hasAllExact(IdentifierTags.State.Fighting);
				return d <= scope; //&& e.tag.hasAllExact(IdentifierTags.State.Fighting);
			})
			.sort((a, b) => mw.Vector.squaredDistance(a.owner.worldTransform.position, my) - mw.Vector.squaredDistance(b.owner.worldTransform.position, my));
		return enemyList[0];
	}
}

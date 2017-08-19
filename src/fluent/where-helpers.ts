import { valueAsDbString } from '../common/dbUtil';
import { WhereCommand } from '../command/command-types/WhereCommand';
import { ObjectType, WhereProperty, WhereSelector } from './';
import { DecoratorStorage } from 'src/storage/DecoratorStorage';

export function createWhereExpressionQueryBase<EntityType>(
  entityType: ObjectType<EntityType> | DecoratorStorage.Entity,
  path: string[] = []):
  WhereSelector<EntityType> {

  let entity = DecoratorStorage.getEntity(entityType as any);
  let columns = entity.columns;

  let parameter = {};
  for (let index = 0; index < columns.length; index++) {
    let column = columns[index];

    let propPath = path.concat(column.name);

    parameter[column.name] = new WherePropertyBase<EntityType, any>(propPath, column, entity);
  }

  return parameter as WhereSelector<EntityType>;
}

class WherePropertyBase<EntityType, PropertyType> implements WhereProperty<EntityType, PropertyType> {

  get not(): WhereProperty<EntityType, PropertyType> {
    return new WherePropertyBase(this.path, this.column, this.entity, !this.negated);
  }

  constructor(
    private path: string[],
    private column: DecoratorStorage.Column,
    private entity: DecoratorStorage.Entity,
    private negated: boolean = false) {
  }

  private createWhereCommand(condition: string): WhereCommand {
    let cmd = new WhereCommand();
    cmd.propertyPath = this.path;
    cmd.negated = this.negated;
    cmd.condition = condition;
    return cmd;
  }

  equals(value: PropertyType): WhereCommand {
    return this.createWhereCommand(' = ' + valueAsDbString(value));
  }

  gt(value: PropertyType): WhereCommand {
    return this.createWhereCommand(' > ' + valueAsDbString(value));
  }

  gte(value: PropertyType): WhereCommand {
    return this.createWhereCommand(' >= ' + valueAsDbString(value));
  }

  lt(value: PropertyType): WhereCommand {
    return this.createWhereCommand(' < ' + valueAsDbString(value));
  }

  lte(value: PropertyType): WhereCommand {
    return this.createWhereCommand(' <= ' + valueAsDbString(value));
  }

  between(minValue: PropertyType, maxValue: PropertyType): WhereCommand {
    return this.createWhereCommand(' BETWEEN ' + valueAsDbString(minValue) + ' AND ' + valueAsDbString(maxValue));
  }

  like(value: string): WhereCommand {
    return this.createWhereCommand(' LIKE ' + valueAsDbString(value, true));
  }

  isNull(): WhereCommand {
    return this.createWhereCommand(' IS NULL');
  }

  in(array: PropertyType[]): WhereCommand {
    return this.createWhereCommand(' IN ' + '(' + array.map(x => valueAsDbString(x)).join(',') + ')');
  }

  asEntity(): WhereSelector<PropertyType> {
    let entity = DecoratorStorage.getEntity(this.column.type);

    if (!this.column.isNavigationProperty)
      throw Error('Only navigation properties can be queried as entity.');

    return createWhereExpressionQueryBase<PropertyType>(entity, this.path);
  }
}

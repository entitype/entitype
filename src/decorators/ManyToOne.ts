import 'reflect-metadata';

import { resolveType, TypeResolver } from '../common/forwardRef';
import { NavigationPropertyDecorator } from '../decorators';
import { PropertyExpression } from '../fluent';
import { resolvePropertyExpression } from '../fluent/property-selector';
import { DecoratorStorage } from '../storage/DecoratorStorage';


export function ManyToOne<EntityType, SelectType>(
  foreignKeyEntity: TypeResolver<EntityType>,
  foreignKey: PropertyExpression<EntityType, SelectType>)
  : NavigationPropertyDecorator {

  let propertyDecorator = (target, propertyKey) => {
    let fk = {
      owner: resolveType(foreignKeyEntity),
      column: resolvePropertyExpression(foreignKey)
    };

    let type = Reflect.getMetadata('design:type', target, propertyKey);

    let column = DecoratorStorage.addColumn(target.constructor, propertyKey, () => type, {});
    column.isNavigationProperty = true;
    column.foreignKey = fk;
    DecoratorStorage.updateEntityReferences(column.parent);
  };


  return propertyDecorator;
}

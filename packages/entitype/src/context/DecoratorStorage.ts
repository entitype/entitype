
export namespace DecoratorStorage {
  export class Entity {
    type: Function;
    name: string;
    dbName: string;

    columns: Column[] = [];

    constructor(init?: Partial<Entity>) {
      Object.assign(this, init);
    }
  }

  export class Column {
    parent: Entity;
    type: string;
    name: string | symbol;
    dbName: string;

    isArray: boolean = false;
    isNavigationProperty: boolean = false;
    isForeignKey: boolean = false;

    constructor(init?: Partial<Column>) {
      Object.assign(this, init);
    }
  }

  let targetStorage: { [key: string]: Entity } = {};

  export function addEntity(entity: Function): Entity {
    return targetStorage[entity.name] = new Entity({
      name: entity.name,
      type: entity,
      dbName: entity.name
    });
  }


  export function addColumn(parent: Function, columnName: string | symbol, metadata: any): Column {
    let type = 'int';
    if (metadata) {
      type = metadata.type;
    }

    let entity = targetStorage[parent.name] || addEntity(parent);

    let column = new Column({
      dbName: columnName.toString(),
      name: columnName,
      parent: entity,
      type: type
    });

    entity.columns.push(column);

    return column;
  }

  export function getEntity(type: Function): Entity {
    let entity = targetStorage[type.name];
    return entity;
  }
}
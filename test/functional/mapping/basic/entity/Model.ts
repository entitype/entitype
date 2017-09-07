import { ChildModel } from './ChildModel';
import { Column } from 'src/decorators/Column';
import { OneToOne } from 'src/decorators/OneToOne';
import { OtherModel } from './OtherModel';

export class Model {
  @Column().primaryKey()
  id: number;

  @Column()
  name: string;

  @OneToOne(Model, x => x.child_id)
  child: ChildModel;

  @Column()
  child_id: number;

  @OneToOne(OtherModel, x => x.parent_id)
  other: OtherModel;

}

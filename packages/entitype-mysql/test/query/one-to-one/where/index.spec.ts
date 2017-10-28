import { expect } from 'chai';
import { Context } from './entity/Context';

describe('query > one-to-one > where', async () => {

  it('should be able to filter from owned side', async () => {
    let ctx = new Context();
    let loadModelQuery = ctx.models
      .where(x => x.child.name).equals('childname')
      .select(x => x.name)
      .toList.query;

    expect(loadModelQuery).to
      .match(/SELECT .* FROM Model as t0 LEFT JOIN ChildModel as t\d+ ON t\d+.parent_id = t0.id WHERE .*t\d+.name = 'childname'.*/i);
  });
});

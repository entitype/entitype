import { expect } from 'chai';

import { CommandType } from '../../../src/command/CommandType';
import { container } from '../../../src/ioc';
import { ConditionType } from '../../../src/plugins';
import * as uc from '../../config/university-context';
import { mockDriverToReturnData } from '../../mock';
import { Context } from './entity/Context';

describe('entitype > query-context', async () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  it('should correctly create context in include statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let [include] = ctx.includes;

      expect(include.propertyPath).to.eql(['child']);
    });

    let ctx = new Context();
    await ctx.models.include(x => x.child).toList.query;
  });

  it('should correctly create context in deep include statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let [include] = ctx.includes;

      expect(include.propertyPath).to.eql(['courses', 'instructor']);
    });

    let ctx = new uc.UniversityContext();
    await ctx.instructors.include(x => x.courses, x => x.instructor).toList.query;
  });


  it('should correctly create context in limit statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let take = ctx.take;
      expect(take.amount).to.be.eql(5);
    });

    let ctx = new Context();
    await ctx.models.take(5).toList.query;
  });

  it('should correctly create context in skip statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let skip = ctx.skip;
      expect(skip.amount).to.be.eql(10);
      expect(ctx.first).to.be.not.null;
      expect(ctx.isQuery).to.be.not.null;
    });

    let ctx = new Context();
    await ctx.models.skip(10).first.query;
  });

  it('should correctly create context in order statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let [ascOrder, descOrder, ascOrder2] = ctx.orders;

      expect(ascOrder.descending).to.be.eql(false);
      expect(ascOrder.propertyPath).to.be.eql(['id']);

      expect(descOrder.descending).to.be.eql(true);
      expect(descOrder.propertyPath).to.be.eql(['child', 'id']);

      expect(ascOrder2.descending).to.be.eql(false);
      expect(ascOrder2.propertyPath).to.be.eql(['name']);
    });

    let ctx = new Context();
    await ctx.models.orderByAscending(x => x.id)
      .thenByDescending(x => x.child.id)
      .thenByAscending(x => x.name)
      .first.query;
  });

  it('should correctly create context in where statements', async () => {
    mockDriverToReturnData(null, ctx => {
      let wheres = ctx.wheres;
      let [group1, group2, group3, group4, group5] = ctx.whereGroups;
      let [whereGt5, whereLte10] = group1;
      let [whereNameEquals, whereOtherNameNotNull] = group2;
      let [whereGte6, whereLt7] = group3;
      let [whereBetween, whereLike, whereIn] = group4;
      let [whereChildNotNull] = group5;

      expect(wheres.length).to.be.equal(10);

      expect(whereGt5.parameters).to.be.eql([5]);
      expect(whereGt5.conditionType).to.be.eql(ConditionType.GreaterThan);
      expect(whereGt5.negated).to.be.eql(false);
      expect(whereGt5.propertyPath).to.be.eql(['id']);

      expect(whereGte6.parameters).to.be.eql([6]);
      expect(whereGte6.conditionType).to.be.eql(ConditionType.GreaterThanOrEqual);
      expect(whereGte6.negated).to.be.eql(false);
      expect(whereGte6.propertyPath).to.be.eql(['id']);

      expect(whereLte10.parameters).to.be.eql([10]);
      expect(whereLte10.conditionType).to.be.eql(ConditionType.LessThanOrEqual);
      expect(whereLte10.negated).to.be.eql(false);
      expect(whereLte10.propertyPath).to.be.eql(['id']);

      expect(whereLt7.parameters).to.be.eql([7]);
      expect(whereLt7.conditionType).to.be.eql(ConditionType.LessThan);
      expect(whereLt7.negated).to.be.eql(false);
      expect(whereLt7.propertyPath).to.be.eql(['id']);

      expect(whereNameEquals.parameters).to.be.eql(['Model 3']);
      expect(whereNameEquals.conditionType).to.be.eql(ConditionType.Equals);
      expect(whereNameEquals.negated).to.be.eql(false);
      expect(whereNameEquals.propertyPath).to.be.eql(['name']);

      expect(whereOtherNameNotNull.conditionType).to.be.eql(ConditionType.IsNull);
      expect(whereOtherNameNotNull.parameters).to.be.eql([]);
      expect(whereOtherNameNotNull.negated).to.be.eql(true);
      expect(whereOtherNameNotNull.propertyPath).to.be.eql(['other', 'name']);


      expect(whereBetween.conditionType).to.be.eql(ConditionType.Between);
      expect(whereBetween.parameters).to.be.eql([3, 8]);
      expect(whereBetween.negated).to.be.eql(false);
      expect(whereBetween.propertyPath).to.be.eql(['id']);

      expect(whereLike.conditionType).to.be.eql(ConditionType.Like);
      expect(whereLike.parameters).to.be.eql(['hello']);
      expect(whereLike.negated).to.be.eql(false);
      expect(whereLike.propertyPath).to.be.eql(['id']);

      expect(whereIn.conditionType).to.be.eql(ConditionType.In);
      expect(whereIn.parameters).to.be.eql([[1, 2]]);
      expect(whereIn.negated).to.be.eql(false);
      expect(whereIn.propertyPath).to.be.eql(['id']);


      expect(whereChildNotNull.conditionType).to.be.eql(ConditionType.IsNull);
      expect(whereChildNotNull.parameters).to.be.eql([]);
      expect(whereChildNotNull.negated).to.be.eql(true);
      expect(whereChildNotNull.propertyPath).to.be.eql(['child', 'id']);
    });

    let ctx = new Context();
    await ctx.models
      .where(x => x.id).greaterThan(5).and.where(x => x.id).lessThanOrEqual(10)
      .or
      .where(x => x.name).equals('Model 3').and.where(x => x.other.name).not.isNull()
      .or
      .where(x => x.id).greaterThanOrEqual(6).and.where(x => x.id).lessThan(7)
      .or
      .where(x => x.id).between(3, 8).and.where(x => x.id).like('hello').and.where(x => x.id).in([1, 2])
      .or
      .where(x => x.child).not.isNull()
      .count.query;
  });


  it('should correctly create context in insert statements', async () => {
    mockDriverToReturnData([], ctx => {
      expect(ctx.edit.entry).to.be.equal(entry);
      expect(ctx.edit.type).to.eql(CommandType.Insert);
    });

    let entry = {};
    let ctx = new Context();
    await ctx.models.insert(entry as any);
  });

  it('should correctly create context in update statements', async () => {
    mockDriverToReturnData([], ctx => {
      expect(ctx.edit.entry).to.be.equal(entry);
      expect(ctx.edit.type).to.eql(CommandType.Update);
    });

    let entry = {};
    let ctx = new Context();
    await ctx.models.update(entry as any);
  });

  it('should correctly create context in persist statements', async () => {
    mockDriverToReturnData([], ctx => {
      expect(ctx.edit.entry).to.be.equal(entry);
      expect(ctx.edit.type).to.eql(CommandType.Persist);
    });

    let entry = {};
    let ctx = new Context();
    await ctx.models.persist(entry as any);
  });

  it('should correctly create context in set statements', async () => {
    mockDriverToReturnData([], ctx => {
      expect(ctx.edit.entry).to.be.equal(entry);
      expect(ctx.edit.type).to.eql(CommandType.Set);


      let wheres = ctx.wheres;
      let [[whereEq], [whereNotGt5]] = ctx.whereGroups;

      expect(wheres.length).to.be.equal(2);

      expect(whereEq.parameters).to.be.eql(['eq']);
      expect(whereEq.conditionType).to.be.eql(ConditionType.Equals);
      expect(whereEq.negated).to.be.eql(false);
      expect(whereEq.propertyPath).to.be.eql(['name']);

      expect(whereNotGt5.parameters).to.be.eql([5]);
      expect(whereNotGt5.conditionType).to.be.eql(ConditionType.GreaterThan);
      expect(whereNotGt5.negated).to.be.eql(true);
      expect(whereNotGt5.propertyPath).to.be.eql(['id']);

    });

    let entry = {};
    let ctx = new Context();
    await ctx.models
      .when(x => x.name).equals('eq')
      .or
      .when(x => x.id).not.greaterThan(5)
      .set(entry as any);
  });

  it('should throw error when property is unknown in where statements', async () => {
    let ctx = new Context();
    let query = () => ctx.models.where(x => x['asdf']).greaterThan(5).count.query;

    expect(query).to.throw();
  });
});

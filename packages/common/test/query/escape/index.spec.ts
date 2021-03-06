import { expect } from 'chai';

import * as nw from '../../../mywind';
import * as nwsqlite from '../../../northwind-sqlite';

export type MockDriverFunction = (queryCallback?: (query: string) => void) => void;
export function defineTests(adapterName: string, setupConfiguration: () => void, mockDriver?: MockDriverFunction) {
  describe(`${adapterName} > query > escape`, async () => {
    beforeEach(setupConfiguration);

    it('should escape table names', async () => {
      let ctx = new nwsqlite.NorthwindContext();
      let loadModelQuery = ctx.orderDetails.toList.query;
      expect(loadModelQuery).to.satisfySql(/SELECT (t0\..* as a\d+,?)+ FROM `order details` as t0/);
    });

    it('should escape filter parameters', async () => {
      let ctx = new nw.NorthwindContext();
      let loadModelQuery = ctx.customers.where(x => x.firstName).equals(' % name \' " ').select(x => 5).toList.query;
      expect(loadModelQuery).to.satisfySql(`SELECT t0.id as a1 FROM customers as t0 WHERE ( ( t0.first_name = ' \\% name \\' \\" ' ) )`);
    });

    it('should escape ignore percentage symbol in like', async () => {
      let ctx = new nw.NorthwindContext();
      let loadModelQuery = ctx.customers.where(x => x.firstName).like(' % name \' " ').select(x => 5).toList.query;
      expect(loadModelQuery).to.satisfySql(`SELECT t0.id as a1 FROM customers as t0 WHERE ( ( t0.first_name LIKE ' % name \\' \\" ' ) )`);
    });


    it('should be able to query short date', async () => {
      let ctx = new nw.NorthwindContext();
      let date = new Date(Date.UTC(1990, 6, 6));
      let loadModelQuery = ctx.orderDetails.where(x => x.dateAllocated).greaterThan(date).select(x => 5).toList.query;
      expect(loadModelQuery).to.satisfySql(`SELECT t0.id as a1 FROM order_details as t0 WHERE ( ( t0.date_allocated > '1990-07-06 00:00:00' ) )`);
    });

    it('should be able to query long date', async () => {
      let ctx = new nw.NorthwindContext();
      let date = new Date(Date.UTC(1990, 6, 6, 23, 58, 24));
      let loadModelQuery = ctx.orderDetails.where(x => x.dateAllocated).greaterThan(date).select(x => 5).toList.query;
      expect(loadModelQuery).to.satisfySql(`SELECT t0.id as a1 FROM order_details as t0 WHERE ( ( t0.date_allocated > '1990-07-06 23:58:24' ) )`);
    });
  });
}

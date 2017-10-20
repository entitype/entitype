
import { assertColumns, assertEntities, assertForeignKeys } from './helper';

describe('decorators > reversed imports', async () => {

  it('should create and store entities', assertEntities);

  it('should create and store all columns', assertColumns);

  it('should create and store all foreign keys', assertForeignKeys);
});

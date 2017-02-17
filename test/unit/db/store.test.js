const store = require('../../../server/db/store');
const db = store.db;

describe('Store', () => {
    it('get', async () => {
        try {
            await store.get('testget');
        } catch (err) {
            expect(err.name).toEqual('NotFoundError');
        }
        await store.put('testget', 1234);
        var value =  await store.get('testget');
        expect(value).toEqual(1234);
    });

    it('put', async () => {
        await store.put('testput', 123);
        var value =  await store.get('testput');
        expect(value).toEqual(123);
    });

    it('del', async () => {
        await store.put('testdel', 2345)
        await store.del('testdel');
        try {
            await store.get('testdel');
        } catch (err) {
            expect(err.name).toEqual('NotFoundError');
        }
    });
});

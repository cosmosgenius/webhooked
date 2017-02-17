const store = require('../../../server/db/store');
const db = store.db;

describe('Store', () => {
    it('put', (done) => {
        store.put('testput', 123).then(()=>{
            db.get('testput', (err, value) => {
                expect(value).toEqual(123);
                done(err);
            });
        });
    });

    it('get', (done) => {
        db.put('testget', 1234, (err) => {
            if(err) done(err);
            store.get('testget').then((value)=>{
                expect(value).toEqual(1234);
                done();
            }).catch(done);
        });
    });

    it('del', (done) => {
        store.put('testdel', 2345)
            .then(()=> {
                return store.del('testdel');
            })
            .then(()=> {
                db.get('testdel', (err, value) => {
                    expect(err.name).toEqual('NotFoundError');
                    expect(value).toBeUndefined();
                    done();
                });
            }).catch(done);
    });
});

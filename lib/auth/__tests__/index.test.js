const jwt = require('jsonwebtoken');
const auth = require('../');

describe('Auth', () => {
    it('generateToken should generate a valid jwt token', () => {
        const data = {
            'test': '1'
        };
        const key = 'testkey';

        const token = auth.generateToken(key, data);
        const jwttoken = jwt.sign(data, key);

        expect(token).toEqual(jwttoken);
    });

    it('decodeToken should return the original data', () => {
        const data = {
            'test': '1'
        };

        const key = 'testkey';

        const token = auth.generateToken(key, data);
        const decodeddata = auth.decodeToken(token);

        expect(decodeddata).toEqual(expect.objectContaining(data));
    });

    it('verifyToken should return the original data', () => {
        const data = {
            'test': '1'
        };

        const key = 'testkey';

        const token = auth.generateToken(key, data);
        const decodeddata = auth.verifyToken(key, token);

        expect(decodeddata).toEqual(expect.objectContaining(data));
    });
});

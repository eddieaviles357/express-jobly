const {sqlForPartialUpdate} = require('./sql');
const { BadRequestError } = require('../expressError');

let data = null;
let jsToSql = null;
beforeAll(function() {
    data = {
        firstName: 'Aliya',
        lastName: 'Foster',
        age: 32
    };
    jsToSql = { 
        firstName: 'first_name',
        lastName: 'last_name'
      }
})

afterAll(function() {
    data = null;
    jsToSql = null;
})

describe('partial sql query', function () {
    test('should return object', function () {
        expect(sqlForPartialUpdate(data, jsToSql)).toEqual({
            setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
            values: [ 'Aliya', 'Foster', 32 ]
          })   
    })
});

describe('error handling', function() {
    let noData = {}
    test('should return an BadRequestError when no keys are found', function () {
        expect(() => sqlForPartialUpdate(noData, jsToSql)).toThrow(BadRequestError);
    })
})
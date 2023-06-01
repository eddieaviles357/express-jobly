const { BadRequestError } = require("../expressError");

/**  converts data to Parameterized queries
 * Takes 2 objects as parameters
 * 
 * 1st parameter can include { firstName: 'Aliya', age: 32}
 * 2nd parameter can inclue { firstName: 'first_name' }
 * 
 * the 2nd parameter object will be used to convert the key to a valid key in the db
 * e.g. firstName => 'first_name'
 * e.g. age => age, notice age was unaffected
 * 
 * returns an object 
 * { 
 * "setCols": "\"first_name\"=$1, \"age\"=$2",
 * "values": Array [ "Aliya", 32, ], 
 * }
 * 
 * values array will be used to plug in the values in order
 * e.g. "first_name"=$1, "age"=$2 => "first_name"="Aliya", "age"="32"
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // grab keys from dataToUpdate object
  const keys = Object.keys(dataToUpdate);
  // no keys in dataToUpdate object must be an Error
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  // map all keys and apply the index we will use this as a query parameter
  const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}` );

  return {
    setCols: cols.join(", "), // returns valid sql string
    values: Object.values(dataToUpdate), // returns an array of values
  };
}

module.exports = { sqlForPartialUpdate };

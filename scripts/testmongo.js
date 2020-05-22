require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || `mongodb+srv://dbadmin:${encodeURIComponent('Website@2020')}@cluster0-wh7a0.mongodb.net/issuetracker`;

async function testWithSync() {
  console.log('\n----- test mongodb connections ------');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });

  try {
    await client.connect();
    console.log('Connected!!!');

    const db = client.db();
    const collection = db.collection('employees');

    const employee = {id: 11, name: {first: "Joe", last: "Jhon"}, age: 20};
    const result = await collection.insertOne(employee);
    console.log('Insert result:\n', result);

    const docs = await collection.find({_id: result.insertedId}).toArray();
    console.log('Result of find:\n', docs);

  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }  
}

testWithSync();


const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

async function check() {
  try {
    await mongoose.connect(URI);
    const collections = ['projects', 'casestudies', 'skills'];
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col).countDocuments();
      console.log(`${col}: ${count}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

check();

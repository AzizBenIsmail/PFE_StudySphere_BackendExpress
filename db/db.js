const mongoose = require('mongoose')

module.exports.connectToMongoDB = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.URL_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(
    () => {
      console.log('connect to BD');
    }
  ).catch(
    (error) => {
      console.log(error.message);
    }
  );
}

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://dhirajparihar2001_db_user:2prDIq8PWWVPZnNd@cluster0.krk61d1.mongodb.net/indori-gaadiwala';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  const Schema = mongoose.Schema;
  const vehicleSchema = new Schema({}, { strict: false, collection: 'vehicles' });
  const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
  
  const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
  console.log('Total vehicles:', vehicles.length);
  vehicles.forEach((v, i) => {
    console.log(`${i+1}. ${v.title} (${v._id}) - Images:`, v.images);
  });
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

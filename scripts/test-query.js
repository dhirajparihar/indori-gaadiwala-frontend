const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://dhirajparihar2001_db_user:2prDIq8PWWVPZnNd@cluster0.krk61d1.mongodb.net/indori-gaadiwala';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  const Schema = mongoose.Schema;
  const vehicleSchema = new Schema({}, { strict: false, collection: 'vehicles' });
  const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
  
  // Test query
  const fields = 'title,price,originalPrice,discount,images,year,fuelType,transmission,mileage,type,status';
  const queryFields = fields.split(',').join(' ');
  
  const vehicles = await Vehicle.find({}).select(queryFields).limit(6);
  console.log('Fetched vehicles:', vehicles.length);
  console.log(vehicles);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

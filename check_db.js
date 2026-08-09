const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

async function checkDonations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Donation = require('./backend/models/Donation');
    
    const allDonations = await Donation.find({});
    console.log('All Donations count:', allDonations.length);
    if(allDonations.length > 0) {
      console.log('Sample donation:', allDonations[0]);
    }

    const availableDonations = await Donation.find({
      status: 'pending',
      receiver: { $exists: false },
      expiryTime: { $gt: new Date() }
    });
    
    console.log('Available Donations with $exists:false :', availableDonations.length);
    
    const alternativeQuery = await Donation.find({
      status: 'pending',
      receiver: null,
      expiryTime: { $gt: new Date() }
    });
    console.log('Available Donations with receiver: null :', alternativeQuery.length);

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkDonations();

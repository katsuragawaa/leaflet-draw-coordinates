const mongoose = require('mongoose');

// specify DB shape and date types
const dataSchema = new mongoose.Schema({
	name: string,
  coordinates: [lat, lng]
});

// modify all instances of the models produced with noteSchema
dataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// constructor compiled from schema created before, export CommonJS format
module.exports = mongoose.model('Data', dataSchema);

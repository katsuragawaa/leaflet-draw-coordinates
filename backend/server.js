const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// specify DB shape and date types
const propertiesSchema = new mongoose.Schema({
  name: String,
  coordinates: [Number, Number],
});

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// modify all instances of the models produced with noteSchema
propertiesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// constructor compiled from schema created before, export CommonJS format
const Properties = mongoose.model('Properties', propertiesSchema);

app.get('/', async (request, response) => {
  const properties = await Properties.find({});
  response.json(properties);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// query => {location:
//    { $geoWithin:
//       { $geometry:
//         {type:"Polygon", coordinates: [[
// [-25.433043377651206, -49.267501831054695],
// [-25.434903666768577, -49.263553619384766],
// [-25.437539027179923, -49.26183700561524],
// [-25.440329345951717, -49.26115036010743],
// [-25.44280957503829, -49.261493682861335],
// [-25.444669713333667, -49.26252365112305],
// [-25.445134743418084, -49.26544189453126],
// [-25.444824723561343, -49.27316665649414],
// [-25.44389465920232, -49.27608489990235],
// [-25.4409494080117, -49.27762985229493],
// [-25.435523756757824, -49.28398132324219],
// [-25.434283573587678, -49.28260803222657],
// [-25.432113222321195, -49.277973175048835],
// [-25.432113222321195, -49.27299499511719],
// [-25.433043377651206, -49.267501831054695],
// ]]
// }}}}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// specify DB shape and date types
const propertiesSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: String,
      required: true,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point',
    },
    coordinates: [{ type: [Number] }],
  },
  properties: {
    name: String,
  },
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

app.get('/api/:coordinates', async (request, response) => {
	const coordinates = JSON.parse(request.params.coordinates)
	console.log(coordinates)
	let query = {}

	if (coordinates[0]) {
		query = {
      location: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        },
      },
    };
	}
	
  const properties = await Properties.find(query);
	console.log("----------------");
	properties.map(prop => console.log(prop.properties.name))
  response.json(properties);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

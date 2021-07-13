const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// especifica o schema
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

// modifica todas as instâncias dos modelos criado pelo schema
propertiesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Properties = mongoose.model('Properties', propertiesSchema);

app.get('/api/:coordinates', async (request, response) => {
	// transforma de volta para uma lista a string
	const coordinates = JSON.parse(request.params.coordinates)
	let query = {}

	// se recebeu uma coordenada, busca no banco de dados os pontos dentro dessa coordenada
	// caso não, busca todos
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
	properties.map(p => console.log(p.properties.name))

  response.json(properties);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

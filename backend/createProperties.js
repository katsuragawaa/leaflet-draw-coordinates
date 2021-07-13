// script pra criar alguns pontos do banco de dados para teste

const mongoose = require('mongoose');
require('dotenv').config();

const propertiesSchema = new mongoose.Schema({
  location: {
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

propertiesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Properties = mongoose.model('Properties', propertiesSchema);

const test = [
  [-25.40901206215787, -49.27316665649414],
  [-25.410562614158984, -49.263553619384766],
  [-25.413663658358423, -49.25016403198243],
  [-25.414283857629382, -49.24432754516602],
  [-25.415679294326377, -49.24175262451172],
  [-25.418935250483766, -49.2374610900879],
  [-25.424361648676022, -49.23385620117188],
  [-25.428392529196845, -49.23248291015625],
  [-25.448544909163285, -49.23316955566406],
  [-25.449784945488176, -49.2348861694336],
  [-25.450249955817263, -49.23643112182618],
  [-25.451489974580596, -49.2594337463379],
  [-25.45117997108717, -49.27728652954102],
  [-25.450714964350265, -49.278488159179695],
  [-25.452419980271106, -49.28792953491212],
  [-25.451799977275726, -49.29857254028321],
  [-25.449629941646027, -49.302692413330085],
  [-25.446684830729495, -49.30458068847657],
  [-25.4409494080117, -49.305267333984375],
  [-25.4207957573813, -49.30355072021485],
  [-25.417074714874502, -49.30234909057618],
  [-25.41474900498932, -49.3008041381836],
  [-25.412578301958998, -49.29874420166016],
  [-25.40916711825498, -49.29462432861328],
  [-25.40870194936565, -49.29307937622071],
  [-25.40901206215787, -49.27316665649414],
];

// salva as coordenadas e cria um nome aleatório
const saveProperties = async (coord) => {
  const properties = new Properties({
    location: {
      type: 'Point',
      coordinates: [coord[0], coord[1]],
    },
    properties: {
      name: 'Imóvel ' + Math.random().toString(36).substring(7),
    },
  });

  await properties.save().then((result) => {
    console.log('data saved!');
  });
};

test.forEach((coord) => saveProperties(coord));

// mongoose.connection.close();

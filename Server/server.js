require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

require('./db');
const { sequelize } = require('./models');

// Authenticate and sync Sequelize models
sequelize.sync()
    .then(() => console.log('MySQL Database synced via Sequelize'))
    .catch(err => console.error('Unable to sync MySQL database:', err));

const routes = require('./routes');
app.use('/api', routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});










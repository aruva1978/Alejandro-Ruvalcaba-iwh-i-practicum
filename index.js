require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// * Custom object + 3 custom properties for the practicum
const CUSTOM_OBJECT_TYPE = '2-228854926';
const PROPERTIES = ['model_type', 'name', 'year'];

// TODO: ROUTE 1 - Create a new app.get route for the homepage ("/") to call your custom object data.
app.get('/', async (req, res) => {
    const customObjects = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(customObjects, {
            headers,
            params: {
                limit: 100,
                properties: PROPERTIES
            },
            paramsSerializer: { indexes: null }
        });

        const records = resp.data.results;

        res.render('homepage', {
            title: 'Homepage | Integrating With HubSpot I Practicum',
            properties: PROPERTIES,
            records
        });
    } catch (error) {
        console.error(error.response?.data || error);
        res.status(500).send('Error loading homepage data. Check terminal logs.');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for rendering the HTML form in a pug template called updates. (“/update-cobj”)
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
        properties: PROPERTIES
    });
});

// TODO: ROUTE 3 - Create a new app.post route ("/update-cobj") that sends along the data captured by the HTML form.
app.post('/update-cobj', async (req, res) => {
    const createRecord = {
        properties: {
            model_type: req.body.model_type,
            name: req.body.name,
            year: req.body.year
        }
    };

    const customObjects = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(customObjects, createRecord, { headers });
        res.redirect('/update-cobj');
    } catch (err) {
        console.error(err.response?.data || err);
        res.status(500).send('Error creating record. Check terminal logs.');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
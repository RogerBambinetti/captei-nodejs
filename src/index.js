require('@dotenvx/dotenvx').config();
const removeAccents = require('remove-accents');

const database = require('./db/database');

const PortalController = require('./controllers/PortalController');
const SnapshotController = require('./controllers/SnapshotController');

const portalController = new PortalController(database);
const snapshotController = new SnapshotController(database);

async function init() {
    const portals = await portalController.getAll();

    for (const portal of portals) {

        const snapshot = await snapshotController.getByPortal(portal.id);

        console.log(snapshot)

        try {
            console.log(`Starting crawler for ${portal.name}...`);

            const crawlerName = removeAccents(portal.name).replace(/[^A-Z0-9]/ig, "");
            const Crawler = require(`./crawlers/${crawlerName}Crawler`);

            const crawler = new Crawler(portal.url, snapshot.filters);

            snapshotController.updateStatus(snapshot.id, 'rodando');
            //const data = await crawler.getData();
        } catch (err) {
            console.log(`Error while crawling ${portal.name}: ${err.message}`);
        }

        snapshotController.updateStatus(snapshot.id, 'concluido');
    }
}

init();
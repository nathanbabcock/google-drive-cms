const express = require('express');
const app = express();
const port = 3000;
const API_VERSION = 1;
const driveAPI = new (require('./driveAPI'))();

app.listen(port, () => console.log(`DriveConnector backend listening on port ${port}`));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.route('/getSheet')
  .get((req, res) => {
    console.log('GET /getSheet', req.query.id, req.query.range);
    driveAPI.getSheet(req.query.id, req.query.range)
      .then((data)=>{
        res.json(data);
      })
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  });

router.route('/getDoc')
  .get((req, res) => {
    console.log('GET /getDoc', req.query.id);
    driveAPI.getDoc(req.query.id)
      .then(data => res.json(data))
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  });

router.route('/listFiles')
  .get((req, res) => {
    console.log('GET /listFiles', req.query.folder);
    driveAPI.listFiles(req.query.folder)
      .then(data => res.json(data))
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  });

router.route('/getAll')
  .get((req, res) => {
    console.log('GET /getAll', req.query.driveId);
    driveAPI.getAll(req.query.driveId)
      .then(data => res.json(data))
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  });

router.route('/getImage')
  .get((req, res) => {
    // console.log('GET /getImage', req.query.id);
    try {
      res.sendFile('cache/' + req.query.id, { root: './'});
    } catch (e) {
      console.error(e);
      res.sendStatus(404);
    }
  });

app.use(`/api/v${API_VERSION}`, router);

// https://stackoverflow.com/a/21947851
function onExit(callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  process.on('cleanup', callback);

  // do app specific cleaning before exiting
  process.on('exit', function () {
    process.emit('cleanup');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    console.log('Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });
};

const exitHandler = () => driveAPI.writeCache();
onExit(exitHandler);

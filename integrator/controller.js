'use strict';

// CONSTANTS
const SPAWN = require('child_process')
  .spawn;

// MODULE DEFINITION
module.exports = () => {
  const CONTROLLER = {
    ping: ping,
    processImage: processImage
  };

  function ping(req, res) {
    return res.send('Pong!');
  }

  function processImage(req, res) {
    execute(req.body.image)
      .then((data) => { res.status(200).send(data); })
      .catch((err) => { res.status(400).send(err); });
  }

  return CONTROLLER;
};

// AUXILIARY FUNCTIONS
function execute(b64) {
  return new Promise((resolve, reject) => {
    let tesseract = SPAWN('tesseract', ['stdin', 'stdout', '-psm', '7']),
      buffer = Buffer(b64, 'base64');

    tesseract.stdout.on('data', (data) => {
      console.log(`OCR ouput: ${data}`);
      resolve(data);
    });

    tesseract.stderr.on('data', (data) => {
      console.log(`OCR error: ${data}`);
      reject(data);
    });

    tesseract.stdin.write(buffer);
    tesseract.stdin.end();
  });
}

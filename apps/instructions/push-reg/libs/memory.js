const request = require('request');

var memory = {
  length: 256,
  load: async function (id, address) {
    return new Promise((resolve, reject) => {
      request.get('http://memory:80/' + id + "/" + address, (e, response, body) => {
        resolve(parseInt(JSON.parse(body).data));
      })
    });
  },
  store: async function (id, address, value) {
    console.log("Calling store for " + id);
    var url = 'http://memory:80/' + id + '/' + address + '/' + value
    return new Promise((resolve, reject) => {
      request.post(url, (e, response, body) => {
        resolve();
      })
    });
  },
  create: async function (id) {
    return new Promise((resolve, reject) => {
      request.post('http://memory:80/', (e, response, body) => {
        resolve(JSON.parse(body));
      })
    });
  },
  delete: async function (id) {
    return new Promise((resolve, reject) => {
      request.delete('http://memory:80/' + id, (e, response, body) => {
        resolve();
      })
    });
  }
}

module.exports = memory

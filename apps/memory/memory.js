'use strict';

const express = require('express');

function memory() {
  return {
    data: Array(256),
    lastAccess: -1,
    load: function (address) {
      var self = this;

      if (address < 0 || address >= self.data.length) {
        throw "Memory access violation at " + address;
      }

      self.lastAccess = address;
      return self.data[address];
    },
    store: function (address, value) {
      var self = this;

      if (address < 0 || address >= self.data.length) {
        throw "Memory access violation at " + address;
      }

      self.lastAccess = address;
      self.data[address] = value;
    },
    reset: function () {
      var self = this;

      self.lastAccess = -1;
      for (var i = 0, l = self.data.length; i < l; i++) {
        self.data[i] = 0;
      }
    }
  };
};

var memoryStore = {
  store: {},
  lastId: 0,
  get: function(id) {
    var self = this;
    return self.store[id];
  },
  create: function() {
    var self = this;
    var id = ++this.lastId;
    self.store[id] = memory();
    self.store[id].reset();
    return id;
  },
  delete: function(id) {
    var self = this;
    delete self.store[id];
  }
}

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();
app.use((req, result, next) => {
  console.log(req.method + " " + req.originalUrl);
  next();
});

app.get('/:id/:address', (req, res, next) => {
  var memory = memoryStore.get(req.params['id'])
  res.json({ data: memory.load(parseInt(req.params['address'])) });
});
app.post('/', (req, res, next) => {
  var id = memoryStore.create();
  res.json({id: id})
});
app.post('/:id/:address/:value', (req, res, next) => {
  var memory = memoryStore.get(req.params['id'])
  memory.store(parseInt(req.params['address']), parseInt(req.params['value']));
  res.send()
});
app.delete('/:id', (req, res, next) => {
  memoryStore.delete(req.params['id'])
  res.send()
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);


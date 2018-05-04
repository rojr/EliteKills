Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.reduce(function(total,x){return x==value ? total+1 : total}, 0);
        }
    }
});

const fs = require('fs');
const readline = require('readline');
const os = require('os');

var players = document.querySelector("#playerList");

const eliteSaveFiles = os.homedir() + "/Saved\ Games/Frontier\ Developments/Elite\ Dangerous/";

var allEvents = [];

var pvpKills = [];

var uniqPvpKills = [];

var lastFile = '';

var files = fs.readdirSync(eliteSaveFiles);

files = files.sort();

var fileGotTo = 0;

for (var i = 0; i < files.length; i++) {
  file = files[i];

  if (!file.startsWith("Journal.")) {
    continue;
  }

  lastFile = eliteSaveFiles + file;

  processFile(lastFile);
}

setInterval(function() {
  processFile(lastFile);
  console.log(lastFile);

}, 1000);

function processFile(file) {
  var lineReader = readline.createInterface({
    input: fs.createReadStream(lastFile)
  });

  lineReader.on('line', function (line) {
    try {
      var obj = JSON.parse(line);

      if (obj.event == "PVPKill") {
        if (uniqPvpKills.count(line) == 0) {
          uniqPvpKills.push(line);
        } else {
          return;
        }

        pvpKills.push(obj.Victim);

        var event = document.createElement("p");
        event.innerHTML = pvpKills.count(obj.Victim) + ' x ' + obj.Victim;
        players.prepend(event);
      }
    } catch (ex) {}
  });

  lineReader.on('close', function () {
    
  });
}

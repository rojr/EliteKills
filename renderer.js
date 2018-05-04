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

var lastFile = '';

fs.readdir(eliteSaveFiles, (err, files) => {
  files.forEach(file => {
    if (!file.startsWith("Journal.")) {
      return;
    }
    lastFile = eliteSaveFiles + file;

    var lineReader = readline.createInterface({
      input: fs.createReadStream(lastFile)
    });

    lineReader.on('line', function (line) {
      var obj = JSON.parse(line);
      allEvents.push(obj);

      if (obj.event == "PVPKill") {
        pvpKills.push(obj.Victim);

        var event = document.createElement("p");
        event.innerHTML = pvpKills.count(obj.Victim) + ' x ' + obj.Victim;
        players.prepend(event);
      }
    });
  });
})

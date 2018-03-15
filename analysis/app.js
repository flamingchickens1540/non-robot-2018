// Require
window.jQuery = window.$ = require('jquery');
const scout = require('scouting');
const fs = require('fs-extra');

// Initialization
scout.init('blank', false);
const baseline = 0.25; // NB: Change this to increase the threshold of assigning tag(s).
fs.existsSync('cycle/') ? '' : fs.mkdirSync('cycle/');
var matches = [];
var matchNum = 0;
var enter = false;
var totTags = {};
var totTeams = [];
var saveTags = [];
var teamCubeData = {};
var previousTeamRank = {};
var scouts = JSON.parse(fs.readFileSync('scouting/scouts.json', 'utf8'));
var sched =
  fs.existsSync('scouting/schedule.json') ?
    JSON.parse(fs.readFileSync('scouting/schedule.json')) :
    new Noty({
      text: 'No schedule, so immediately start wondering what you\'re doing with your life.',
      type: 'error'
    }).show();
for (var num in sched) {
  if (sched.hasOwnProperty(num)) {
    for (var i = 0; i < 6; i++) {
      if (sched[num][i] == '1540') {
        matches.push(num);
      }
    }
  }
};
var data = [];
var cycle = [];
var manifest = JSON.parse(fs.readFileSync('data/manifest.json', 'utf8'));
for (var i = 0; i < manifest.length; i++) {
  try {
  data.push(JSON.parse(fs.readFileSync('data/' + manifest[i])));} catch(_) {}
};
var cycleManifest = JSON.parse(fs.readFileSync('cycle/manifest.json', 'utf8'));
for (var i = 0; i < cycleManifest.length; i++) {
  cycle.push(JSON.parse(fs.readFileSync('cycle/' + cycleManifest[i])));
};
fs.existsSync('export/') ? '' : fs.mkdirSync('export/');
fs.existsSync('resources/') ? '' : fs.mkdirSync('resources/');
for (var i = 0; i < data.length; i++) {
  saveTags = analyzeTags(data[i].team);
  totTags[data[i].team] = saveTags[0];
  if (totTeams.indexOf(data[i].team) < 0) {
    totTeams.push(data[i].team);
  }
  teamCubeData[data[i].team] = saveTags[1];
};
fs.writeFileSync('export/tags.json', JSON.stringify(totTags));
fs.writeFileSync('resources/team-cube-data.json', JSON.stringify(teamCubeData));
var rankings = analyzeRank();
if (!fs.existsSync('pit-data/')) {
  fs.mkdirSync('pit-data/');
}
var pit = {};
var pitfest = JSON.parse(fs.readFileSync('pit-data/manifest.json', 'utf8'));
for (var i = 0; i < pitfest.length; i++) {
  var tempPit = JSON.parse(fs.readFileSync('pit-data/' + pitfest[i], 'utf8'));
  if (tempPit.team != undefined) {
    pit[tempPit.team] = tempPit;
  }
};
var notesOne = notes('');
var notesTwo = notes('-two');
var notesThree = notes('-three');
var notesFour = notes('-four');
if (!fs.existsSync('match-data/')) {
  fs.mkdirSync('match-data/');
}
var seventhfest = JSON.parse(fs.readFileSync('match-data/manifest.json', 'utf8'));
var seventh = [];
for (var i = 0; i < seventhfest.length; i++) {
  seventh.push(JSON.parse(fs.readFileSync('match-data/' + seventhfest[i], 'utf8')));
  seventh[i].teams = sched[parseInt(seventh[i].match)];
};

// Functions
String.prototype.titleCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
function analyzeTags(a) {
  if (a != undefined) {
    var info = {
      switching: 0,
      scaling: 0,
      exchanging: 0,
      defending: 0,
      total: 0
    };
    var percent = {
      switching: 0,
      scaling: 0,
      exchanging: 0,
      defending: 0
    };
    var tags = [];
    var index = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].team == a) {
        index++;
        if (data[i]['role'] != undefined && data[i]['role'].indexOf('r') >= 0) {
          if (!isNaN(parseInt(data[i].redSwitch))) {
            info.switching += parseInt(data[i].redSwitch);
            info.total += parseInt(data[i].redSwitch);
          }
          if (!isNaN(parseInt(data[i].blueSwitch))) {
            info.defending += parseInt(data[i].blueSwitch);
            info.total += parseInt(data[i].blueSwitch);
          }
          if (!isNaN(parseInt(data[i].redExchange))) {
            info.exchanging += parseInt(data[i].redExchange);
            info.total += parseInt(data[i].redExchange);
          }
        } else if (data[i]['role'] != undefined && data[i]['role'].indexOf('b') >= 0) {
          if (!isNaN(parseInt(data[i].redSwitch))) {
            info.defending += parseInt(data[i].redSwitch);
            info.total += parseInt(data[i].redSwitch);
          }
          if (!isNaN(parseInt(data[i].blueSwitch))) {
            info.switching += parseInt(data[i].blueSwitch);
            info.total += parseInt(data[i].blueSwitch);
          }
          if (!isNaN(parseInt(data[i].blueExchange))) {
            info.exchanging += parseInt(data[i].blueExchange);
            info.total += parseInt(data[i].blueExchange);
          }
        }
        if (!isNaN(parseInt(data[i].switchAuto))) {
          info.switching += parseInt(data[i].switchAuto);
          info.total += parseInt(data[i].switchAuto);
        }
        if (!isNaN(parseInt(data[i].scale))) {
          info.scaling += parseInt(data[i].scale);
          info.total += parseInt(data[i].scale);
        }
        if (!isNaN(parseInt(data[i].scaleAuto))) {
          info.scaling += parseInt(data[i].scaleAuto);
          info.total += parseInt(data[i].scaleAuto);
        }
      }
    };
    percent.switching = parseFloat((info.switching / (info.total == 0 ? 1 : info.total)).toFixed(2));
    percent.scaling = parseFloat((info.scaling / (info.total == 0 ? 1 : info.total)).toFixed(2));
    percent.exchanging = parseFloat((info.exchanging / (info.total == 0 ? 1 : info.total)).toFixed(2));
    percent.defending = parseFloat((info.defending / (info.total == 0 ? 1 : info.total)).toFixed(2));
    if (percent.switching > baseline) {
      tags.push('Switcher');
    }
    if (percent.scaling > baseline) {
      tags.push('Scaler');
    }
    if (percent.exchanging > baseline) {
      tags.push('Exchanger');
    }
    if (percent.defending > baseline) {
      tags.push('Defender');
    }
    return [tags, [parseFloat((info.switching / index).toFixed(2)), parseFloat((info.scaling / index).toFixed(2)), parseFloat((info.exchanging / index).toFixed(2)), parseFloat((info.defending / index).toFixed(2)), parseFloat((info.total / index).toFixed(2))]];
  }
  return [[false], [false, false, false, false, false]];
};
function getTags(a) {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  return tags[a];
};
function notes(a) {
  if (!fs.existsSync('notes' + a + '/')) {
    fs.mkdirSync('notes' + a + '/');
    fs.writeFileSync('notes' + a + '/manifest.json', '[]');
  }
  var notefest = JSON.parse(fs.readFileSync('notes' + a + '/manifest.json', 'utf8'));
  var notes = {};
  for (var i = 0; i < notefest.length; i++) {
    notes[notefest[i].substring(0, notefest[i].length - 5)] = JSON.parse(fs.readFileSync('notes' + a + '/' + notefest[i], 'utf8'));
  };
  return notes;
};
function analyzeRank() {
  if (cycle.length == 0) {
    return analyzeCubes();
  }
  return analyzeCycles();
};
function analyzeCubes() {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  var ranking = {
    'switch': {},
    'scale': {},
    'exchange': {},
    'defense': {},
    'futz': []
  };
  for (var team in tags) {
    if (tags.hasOwnProperty(team)) {
      if (tags[team].length > 0) {
        for (var i = 0; i < tags[team].length; i++) {
          temp = 0;
          switch (tags[team][i]) {
            case 'Switcher':
              for (var j = 0; j < data.length; j++) {
                if (data[j].team == team) {
                  temp += (data[j]['role'].indexOf('r') >= 0 ? (data[j]['redSwitch'] != undefined ? data[j]['redSwitch'] : 0) : (data[j]['blueSwitch'] != undefined ? data[j]['blueSwitch'] : 0));
                }
              };
              ranking['switch'][team] = [1, temp];
              break;
            case 'Scaler':
              for (var j = 0; j < data.length; j++) {
                if (data[j].team == team) {
                  temp += data[j]['scale'] == undefined ? 0 : (data[j]['scale']);
                }
              };
              ranking['scale'][team] = [1, temp];
              break;
            case 'Exchanger':
              for (var j = 0; j < data.length; j++) {
                if (data[j].team == team) {
                  temp += (data[j]['role'].indexOf('r') >= 0 ? (data[j]['redExchange'] != undefined ? data[j]['redExchange'] : 0) : (data[j]['blueExchange'] != undefined ? data[j]['blueExchange'] : 0));
                }
              };
              ranking['exchange'][team] = [1, temp];
              break;
            case 'Defender':
              for (var j = 0; j < data.length; j++) {
                if (data[j].team == team) {
                  temp += (data[j]['role'].indexOf('r') >= 0 ? (data[j]['blueSwitch'] != undefined ? data[j]['blueSwitch'] : 0) : (data[j]['redSwitch'] != undefined ? data[j]['redSwitch'] : 0));
                }
              };
              ranking['defense'][team] = [1, temp];
              break;
          };
        };
      } else {
        ranking['futz'].push(team);
      }
      for (var info in ranking['switch']) {
        if (ranking['switch'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['switch']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['switch'][info][1] < ranking['switch'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['switch'][info][0] = rank;
        }
      };
      for (var info in ranking['scale']) {
        if (ranking['scale'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['scale']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['scale'][info][1] < ranking['scale'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['scale'][info][0] = rank;
        }
      };
      for (var info in ranking['exchange']) {
        if (ranking['exchange'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['exchange']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['exchange'][info][1] < ranking['exchange'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['exchange'][info][0] = rank;
        }
      };
      for (var info in ranking['defense']) {
        if (ranking['defense'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['defense']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['defense'][info][1] < ranking['defense'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['defense'][info][0] = rank;
        }
      };
    }
  };
  fs.writeFileSync('export/rankings.json', JSON.stringify(ranking));
  return ranking;
};
function analyzeCycles() {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  var ranking = {
    'switch': {},
    'scale': {},
    'exchange': {},
    'defense': {},
    'futz': []
  };
  for (var team in tags) {
    if (tags.hasOwnProperty(team)) {
      if (tags[team].length > 0) {
        for (var i = 0; i < tags[team].length; i++) {
          var index = 0;
          switch (tags[team][i]) {
            case 'Switcher':
              if (ranking['switch'][team] == undefined) {
                ranking['switch'][team] = [1, 0];
              }
              for (var j = 0; j < cycle.length; j++) {
                ranking['switch'][team][1] += cycle[j];
                index++;
              };
              ranking['switch'][team][1] /= index;
              break;
            case 'Scaler':
              if (ranking['scale'][team] == undefined) {
                ranking['scale'][team] = [1, 0];
              }
              for (var j = 0; j < cycle.length; j++) {
                ranking['scale'][team][1] += cycle[j];
                index++;
              };
              ranking['scale'][team][1] /= index;
              break;
            case 'Exchanger':
              if (ranking['exchange'][team] == undefined) {
                ranking['exchange'][team] = [1, 0];
              }
              for (var j = 0; j < cycle.length; j++) {
                ranking['exchange'][team][1] += cycle[j];
                index++;
              };
              ranking['exchange'][team][1] /= index;
              break;
            case 'Defender':
              if (ranking['defense'][team] == undefined) {
                ranking['defense'][team] = [1, 0];
              }
              for (var j = 0; j < cycle.length; j++) {
                ranking['defense'][team][1] += cycle[j];
                index++;
              };
              ranking['defense'][team][1] /= index;
              break;
          };
        };
      } else {
        ranking['futz'].push(team);
      }
      for (var info in ranking['switch']) {
        if (ranking['switch'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['switch']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['switch'][info][1] > ranking['switch'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['switch'][info][0] = rank;
        }
      };
      for (var info in ranking['scale']) {
        if (ranking['scale'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['scale']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['scale'][info][1] > ranking['scale'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['scale'][info][0] = rank;
        }
      };
      for (var info in ranking['exchange']) {
        if (ranking['exchange'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['exchange']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['exchange'][info][1] > ranking['exchange'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['exchange'][info][0] = rank;
        }
      };
      for (var info in ranking['defense']) {
        if (ranking['defense'].hasOwnProperty(info)) {
          rank = 1;
          teamList = Object.keys(ranking['defense']);
          for (var i = 0; i < teamList.length; i++) {
            if (ranking['defense'][info][1] > ranking['defense'][teamList[i]][1]) {
              rank++;
            }
          };
          ranking['defense'][info][0] = rank;
        }
      };
    }
  };
  fs.writeFileSync('export/rankings.json', JSON.stringify(ranking));
  return ranking;
};
function displayRank(a, b) {
  var index = 0;
  $('.cell-rankings-' + b).append(`
    <table class="table table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
        </tr>
      </thead>
      <tbody class="` + a + `-tbody-1"></tbody>
    </table>
  `);
  for (var i = 0; i < totTeams.length; i++) {
    for (var team in rankings[a]) {
      if (rankings[a].hasOwnProperty(team)) {
        if (rankings[a][team] != undefined && rankings[a][team][0] == i + 1) {
          $('.' + a + '-tbody-1').append(`
            <tr>
              <td>` + (i + 1) + `</td>
              <td>` + team + `</td>
            </tr>
          `);
        }
      }
    };
  };
};
function modal(a, b, c) {
  if (c == undefined) {
    c = true;
  }
  return (`
    <div class="modal fade" id="` + a + `" role="dialog" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  ` + (!c ? `<th scope="col">Cube</th>` : ``) + `
                  ` + (c ? (b ? `<th scope="col">Auto</th>` : ``) : `<th scope="col">Climb</th>`) + `
                  <th scope="col">` + (c ? 'Cube' : 'Notes') + `</th>
                </tr>
              </thead>
              <tbody class="` + a + `-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `);
};
function matchDisplay(a) {
  var tempNotes = {};
  var seventhNotes = {};
  for (var i in notesOne) {
    if (notesOne[i][$('.lookup-team').text()] != undefined) {
      tempNotes[i] = ' ' + notesOne[i][$('.lookup-team').text()];
    }
  };
  for (var i in notesTwo) {
    if (notesTwo[i][$('.lookup-team').text()] != undefined) {
      tempNotes[i] += '\n' + notesTwo[i][$('.lookup-team').text()];
    }
  };
  for (var i in notesThree) {
    if (notesThree[i][$('.lookup-team').text()] != undefined) {
      tempNotes[i] += '\n' + notesThree[i][$('.lookup-team').text()];
    }
  };
  for (var i in notesFour) {
    if (notesFour[i][$('.lookup-team').text()] != undefined) {
      tempNotes[i] += '\n' + notesFour[i][$('.lookup-team').text()];
    }
  };
  for (var i = 0; i < seventh.length; i++) {
    var teamVal = seventh[i]['teams'].indexOf($('.lookup-team').text());
    if (teamVal != -1) {
      seventhNotes[i + 1] = [teamVal <= 2 ? (seventh[i]['redswitch-' + teamVal] == undefined ? 0 : seventh[i]['redswitch-' + teamVal]) : seventh[i]['blueswitch-' + teamVal], (seventh[i]['scale-' + teamVal] == undefined ? 0 : seventh[i]['scale-' + teamVal]), teamVal >= 3 ? (seventh[i]['redswitch-' + teamVal] == undefined ? 0 : seventh[i]['redswitch-' + teamVal]) : (seventh[i]['blueswitch-' + teamVal] == undefined ? 0 : seventh[i]['blueswitch-' + teamVal])];
    }
  };
  for (var i = 0; i < data.length; i++) {
    if (data[i].team == $('.lookup-team').text()) {
      currentScout = data[i].scouts == undefined ? 'Anonymous Scout' : scouts[JSON.parse(data[i].scouts).scout];
      switch (a) {
        case 'hswitch':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i].switchAuto == undefined ? 0 : data[i].switchAuto) + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].redSwitch == undefined ? 0 : data[i].redSwitch) : (data[i].blueSwitch == undefined ? 0 : data[i].blueSwitch)) + `</td>
            </tr>
          `);
          break;
        case 'oswitch':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].blueSwitch == undefined ? 0 : data[i].blueSwitch) : (data[i].redSwitch == undefined ? 0 : data[i].redSwitch)) + `</td>
            </tr>
          `);
          break;
        case 'hplatform':
          var climbType;
          climbType = data[i].climb == undefined ? '❌' : data[i].climb;
          if (data[i].assist != undefined) {
            climbType = data[i].assist == 'false' ? climbType : climbType + ': ' + data[i].assist;
          }
          if (data[i].noclimb != undefined) {
            climbType = data[i].noclimb == 'false' ? '❌' : data[i].noclimb;
          }
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].redPlatformCube == undefined ? 0 : data[i].redPlatformCube) : (data[i].bluePlatformCube == undefined ? 0 : data[i].bluePlatformCube)) + `</td>
              <td>` + climbType + `</td>
              <td>` + (data[i].climbNotes == undefined ? 'None :(' : data[i].climbNotes) + `</td>
            </tr>
          `);
          break;
        case 'oplatform':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].bluePlatformCube == undefined ? 0 : data[i].bluePlatformCube) : (data[i].redPlatformCube == undefined ? 0 : data[i].redPlatformCube)) + `</td>
            </tr>
          `);
          break;
        case 'scale':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i].scaleAuto == undefined ? 0 : data[i].scaleAuto) + `</td>
              <td>` + (data[i].scale == undefined ? 0 : data[i].scale) + `</td>
            </tr>
          `);
          break;
        case 'exchange':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].redExchange == undefined ? 0 : data[i].redExchange) : (data[i].blueExchange == undefined ? 0 : data[i].blueExchange)) + `</td>
            </tr>
          `);
          break;
        case 'portal':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? (data[i].redPortal == undefined ? 0 : data[i].redPortal) : (data[i].bluePortal == undefined ? 0 : data[i].bluePortal)) + `</td>
            </tr>
          `);
          break;
        case 'notes':
          $('.lookup-' + a).append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + currentScout + `</td>
              <td>` + (data[i].crossLine == 'true' ? '✅' : '❌') + `</td>
              <td>` + (data[i].notes == undefined ? 'None :(' : data[i].notes) + `</td>
              <td>` + (tempNotes[data[i].match] == undefined ? 'None :(' : tempNotes[data[i].match]) + `</td>
              <td>` + (seventhNotes[data[i].match] == undefined ? 0 : seventhNotes[data[i].match][0]) + `</td>
              <td>` + (seventhNotes[data[i].match] == undefined ? 0 : seventhNotes[data[i].match][1]) + `</td>
              <td>` + (seventhNotes[data[i].match] == undefined ? 0 : seventhNotes[data[i].match][2]) + `</td>
            </tr>
          `);
          break;
      }
    }
  };
};
function card(a, b) {
  return (`
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">` + a + `</h5>
        <p class="card-text">` + b + `</p>
      </div>
    </div>
    <br>
  `);
};
function pitHelper(a, b) {
  switch (a) {
    case 'leftSwitchAuto':
      b.push(' Left Switch');
      break;
    case 'rightSwitchAuto':
      b.push(' Right Switch');
      break;
    case 'leftScaleAuto':
      b.push(' Left Scale');
      break;
    case 'rightScaleAuto':
      b.push(' Right Scale');
      break;
    case 'twoCubeAuto':
      b.push(' Two Cube');
      break;
    case 'exchangeAuto':
      b.push(' Exchange');
      break;
    case 'lineAuto':
      b.push(' Cross Line');
      break;
  };
};
function prettifyArray(a) {
  var temp = [];
  for (var i = 0; i < a.length; i++) {
    temp[i] = ' ' + a[i];
  };
  return temp;
};

// Home
scout.page('Home', [3, 3, 3, 3]);
scout.checkbox('.cell-home-1', '', [{text: 'Match Schedule', color: 'primary'}], 'asdf', false, 'btn-home btn-match-schedule');
scout.checkbox('.cell-home-2', '', [{text: 'Team Lookup', color: 'primary'}], 'asdf', false, 'btn-home btn-team-lookup');
scout.checkbox('.cell-home-3', '', [{text: 'Rankings', color: 'primary'}], 'asdf', false, 'btn-home btn-rankings');
scout.checkbox('.cell-home-4', '', [{text: 'Picklist', color: 'primary'}], 'asdf', false, 'btn-home btn-picklist');
$('.btn-match-schedule').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-match-schedule').fadeIn(500);
    $('.scout-mc').removeClass('active');
  });
});
$('.btn-team-lookup').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-team-lookup').fadeIn(500);
  });
});
$('.btn-rankings').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-rankings').fadeIn(500);
  });
});
$('.btn-picklist').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-picklist').fadeIn(500);
  });
});

// Match Schedule
scout.page('Match Schedule', [4, 4, 4]);
for (var i = 0; i < matches.length; i++) {
  matchNum = matchNum == 3 ? 0 : matchNum + 1;
  $('.cell-match-schedule-' + matchNum).append(`
    <br><br>
    <h3 style="text-align: center;">Match ` + matches[i] + `</h3>
    <br><br>
    <div style="text-align: center;">
      <button class="btn btn` + (sched[matches[i]][0] != 1540 ? '-outline' : '') + `-danger btn-team">` + sched[matches[i]][0] + `</button>
      <button class="btn btn` + (sched[matches[i]][1] != 1540 ? '-outline' : '') + `-danger btn-team">` + sched[matches[i]][1] + `</button>
      <button class="btn btn` + (sched[matches[i]][2] != 1540 ? '-outline' : '') + `-danger btn-team">` + sched[matches[i]][2] + `</button>
      <br><br>
      <button class="btn btn` + (sched[matches[i]][3] != 1540 ? '-outline' : '') + `-primary btn-team">` + sched[matches[i]][3] + `</button>
      <button class="btn btn` + (sched[matches[i]][4] != 1540 ? '-outline' : '') + `-primary btn-team">` + sched[matches[i]][4] + `</button>
      <button class="btn btn` + (sched[matches[i]][5] != 1540 ? '-outline' : '') + `-primary btn-team">` + sched[matches[i]][5] + `</button>
    </div>
  `);
};
$('.btn-team').click(function () {
  var team = $(this).text();
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-team-lookup').show();
    $('.input-team-lookup > input')
      .val(team)
      .focus();
  });
});

// Team Lookup
scout.page('Team Lookup', [12]);
scout.input('.cell-team-lookup-1', '', '1540', 'asdf', false, 'input-team-lookup');
$('.input-team-lookup > input').keydown(function () {
  if (event.which == 13) {
    if (!enter) {
      // var left = [];
      // var mid = [];
      // var right = [];
      // for (var attr in pit[$(this).val()]) {
      //   if (pit[$(this).val()].hasOwnProperty(attr)) {
      //     if (pit[$(this).val()][attr].indexOf('Left Auto') >= 0) {
      //       pitHelper(attr, left);
      //     }
      //     if (pit[$(this).val()][attr].indexOf('Mid Auto') >= 0) {
      //       pitHelper(attr, mid);
      //     }
      //     if (pit[$(this).val()][attr].indexOf('Right Auto') >= 0) {
      //       pitHelper(attr, right);
      //     }
      //   }
      // };
      // if (pit[$(this).val()]['cubeLoad'] != undefined && typeof pit[$(this).val()]['cubeLoad'] == 'object') {
      //   for (var j = 0; j < pit[$(this).val()]['cubeLoad'].length; j++) {
      //     pit[$(this).val()]['cubeLoad'][j] = ' ' + pit[$(this).val()]['cubeLoad'][j];
      //   };
      // }
      var template = {
        'team': 'N/A',
        'scout': 'N/A',
        'phone': 'N/A',
        'occupation': 'N/A',
        'switchAuto': 'N/A',
        'scaleAuto': 'N/A',
        'exchangeAuto': 'N/A',
        'twoCubeAuto': 'N/A',
        'lineAuto': 'N/A',
        'robotRole': ['N/A'],
        'robotRoleNotes': 'N/A',
        'climb': 'N/A',
        'climbNotes': 'N/A',
        'cubeLoad': ['N/A'],
        'lang': 'N/A',
        'driveTrain': 'N/A',
        'weight': 'N/A',
        'notes': 'N/A'
      };
      if (pit[$(this).val()] == undefined) {
        pit[$(this).val()] = {};
      }
      for (var i in template) {
        if (template.hasOwnProperty(i)) {
          if (pit[$(this).val()][i] == undefined) {
            pit[$(this).val()][i] = ['N/A'];
          }
        }
      };
      $('.team-lookup').after(`
        <div class="after-team-lookup">
          <h2 class="lookup-team" style="text-align: center;">` + $(this).val() + `</h2>
          <br>
          <div class="analysis-tags container"></div>
          <br>
          <div class="analysis-arcade" style="text-align: center;">
            <img src="media/labeled-arcade.png" style="width: 1224px; margin: 0; padding: 0;" usemap="#arcade">
            <map name="arcade">
              <area class="lookup-hswitch" shape="rect" coords="339, 263, 465, 302" data-toggle="modal" data-target="#hswitch">
              ` + modal('hswitch', true) + `
              <area class="lookup-oswitch" shape="rect" coords="738, 263, 894, 302" data-toggle="modal" data-target="#oswitch">
              ` + modal('oswitch', false) + `
              <area class="lookup-hplatform" shape="rect" coords="454, 209, 593, 247" data-toggle="modal" data-target="#hplatform">
              ` + modal('hplatform', false, false) + `
              <area class="lookup-oplatform" shape="rect" coords="632, 209, 801, 247" data-toggle="modal" data-target="#oplatform">
              ` + modal('oplatform', false) + `
              <area class="lookup-scale" shape="rect" coords="580, 280, 648, 319" data-toggle="modal" data-target="#scale">
              ` + modal('scale', true) + `
              <area class="lookup-exchange" shape="rect" coords="108, 187, 266, 225" data-toggle="modal" data-target="#exchange">
              ` + modal('exchange') + `
              <area class="lookup-portal" shape="rect" coords="1103, 24, 1174, 64" data-toggle="modal" data-target="#portal">
              ` + modal('portal', false) + `
            </map>
          </div>
          <div class="container">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Cross Line</th>
                  <th scope="col">Stand App Notes</th>
                  <th scope="col">Notes App Notes</th>
                  <th scope="col">Switch</th>
                  <th scope="col">Scale</th>
                  <th scope="col">Defense</th>
                </tr>
              </thead>
              <tbody class="lookup-notes"></tbody>
            </table>
            <br>
            <br>
            <button class="btn btn-danger">Average Cubes: ` + (teamCubeData[$(this).val()] == undefined ? 'N/A' : teamCubeData[$(this).val()][4]) + `</button>
            <button class="btn btn-danger">Average Climb Rate (w/ Levitate): <span class="climb-rate-avg-lev"></span></button>
            <button class="btn btn-danger">Average Climb Rate (w/o Levitate): <span class="climb-rate-avg"></span></button>
            <button class="btn btn-warning view-pit" data-toggle="modal" data-target="#pit-modal">View Pit Data</button>
            <div class="modal fade" id="pit-modal" role="dialog" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-body">
                    <h2 style="margin-left: 2vw; margin-top: 2vh;">Pit Data</h2>
                    <br>
                    <div class="row">
                      <div class="col-sm-4">`
                      + card('Phone Number', pit[$(this).val()]['phone'] + ` (` + (pit[$(this).val()]['occupation'] == 'true' ? 'Mentor' : (pit[$(this).val()]['occupation'] == 'false' ? 'Student' : 'N/A')) + `)`)
                      + card('Scale Auto', pit[$(this).val()]['scaleAuto'])
                      + card('Climb', (pit[$(this).val()]['climb'] == 'false' ? 'No Climb :(' : pit[$(this).val()]['climb']))
                      + card('Cube Load Location', (pit[$(this).val()]['cubeLoad'] == undefined ? 'nope' : prettifyArray(pit[$(this).val()]['cubeLoad'])))
                      + card('Exchange Auto', pit[$(this).val()]['exchangeAuto'])
                    + `</div>
                      <div class="col-sm-4">`
                      + card('Switch Auto', pit[$(this).val()]['switchAuto'])
                      + card('Role', prettifyArray(pit[$(this).val()]['robotRole']))
                      + card('Climb Notes', pit[$(this).val()]['climbNotes'])
                      + card('Language', pit[$(this).val()]['lang'])
                      + card('Weight', pit[$(this).val()]['weight'])
                      + card('Notes', pit[$(this).val()]['notes'])
                    + `</div>
                      <div class="col-sm-4">`
                      + card('Exchange Auto', pit[$(this).val()]['exchangeAuto'])
                      + card('Role Notes', pit[$(this).val()]['robotRoleNotes'])
                      + card('Wheels', pit[$(this).val()]['driveTrain'])
                      + card('Two Cube Auto', pit[$(this).val()]['twoCubeAuto'])
                      + card('Cross Line Auto', pit[$(this).val()]['lineAuto'])
                    + `</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br>
        </div>
      `);
      enter = true;
      if (totTeams.indexOf($(this).val()) >= 0) {
        var lookupTags = getTags($(this).val());
        for (var i = 0; i < lookupTags.length; i++) {
          var temp;
          switch (lookupTags[i]) {
            case 'Switcher':
              temp = 'switch';
              break;
            case 'Scaler':
              temp = 'scale';
              break;
            case 'Exchanger':
              temp = 'exchange';
              break;
            case 'Defender':
              temp = 'defense'
              break;
          }
          $('.analysis-tags').append('<button class="btn btn-outline-info">' + lookupTags[i] + ' - ' + rankings[temp][$('.lookup-team').text()][0] + '</button>&nbsp;&nbsp;&nbsp;');
        };
        var lev = 0;
        var noLev = 0;
        var noLevRateCount = 0;
        var levRateCount = 0;
        var levRate = 0;
        var noLevRate = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].team == $(this).val()) {
            if ((data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != undefined && (data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != false && (data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != 'park') {
              lev++;
              levRateCount++;
              levRate = parseFloat(lev / levRateCount * 100).toFixed(2);
            } else if ((data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != undefined && (data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != false && (data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatform : data[i].bluePlatform) != 'park') {
              noLev++;
              noLevRateCount++;
              noLevRate = parseFloat(noLev / noLevRateCount * 100).toFixed(2);
            }
          }
        };
        $('.climb-rate-avg-lev').text(levRate + '%');
        $('.climb-rate-avg').text(noLevRate + '%');
      } else {
        new Noty({
          text: 'This team is not competing at this event, or maybe they\'re an FLL team.',
          type: 'error',
          timeout: 2000
        }).show();
      }
      $('.hswitch-tbody').append(matchDisplay('hswitch'));
      $('.oswitch-tbody').append(matchDisplay('oswitch'));
      $('.hplatform-tbody').append(matchDisplay('hplatform'));
      $('.oplatform-tbody').append(matchDisplay('oplatform'));
      $('.scale-tbody').append(matchDisplay('scale'));
      $('.exchange-tbody').append(matchDisplay('exchange'));
      $('.portal-tbody').append(matchDisplay('portal'));
      $('.lookup-notes').append(matchDisplay('notes'));
    }
  } else {
    enter = false;
    $('.after-team-lookup').remove();
  }
});

// Rankings
scout.page('Rankings', [3, 3, 3, 3]);
scout.text('.cell-rankings-1', 'Switch', 28);
scout.text('.cell-rankings-2', 'Scale', 28);
scout.text('.cell-rankings-3', 'Exchange', 28);
scout.text('.cell-rankings-4', 'Defense', 28);
displayRank('switch', 1);
displayRank('scale', 2);
displayRank('exchange', 3);
displayRank('defense', 4);
$('.btn-rank-team')
  .click(function () {
    var teamNum = $(this).children('.btn-team').text();
    setTimeout(function () {
      $('.btn-rank-team').removeClass('active');
    }, 10);
    $('.page-pane').fadeOut(250, function () {
      $('.body-div-team-lookup').show();
      $('.input-team-lookup > input')
        .val(teamNum)
        .focus();
    });
  });

// Picklist
scout.page('Picklist', [12]);
$('.cell-picklist-1').html(`
  <table class="table table-hover pick-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Team</th>
        <th scope="col">Notes</th>
      </tr>
    </thead>
    <tbody class="picklist-table"></tbody>
  </table>
`);
var tempTeams = totTeams;
tempTeams.sort(function (a, b) {return a - b});
for (var i = 0; i < tempTeams.length; i++) {
  $('.picklist-table').append(`
    <tr class="team-pick">
      <td class="team-pick-rank">` + (i + 1) + `</td>
      <td class="team-pick-num">` + tempTeams[i] + `</td>
      <td class="team-pick-notes">
        <textarea class="form-control" placeholder="Notes on ` + tempTeams[i] + `..." col="3"></textarea>
      </td>
    </tr>
  `);
};
sortable = $('.picklist-table').sortable({
  connectWith: '.picklist-table',
  items: ".sorting-initialize"
});
sortable.find('.team-pick').one('mouseenter',function(){
    $(this).addClass('sorting-initialize');
    sortable.sortable('refresh');
});
$('.picklist-table')
  .mouseup(function () {
    setTimeout(function () {
      $('.team-pick').each(function (i) {
        $(this).children('.team-pick-rank').text(i + 1);
      });
    }, 10);
  });

// End
$('.btn-next').remove();
$('.btn-back')
  .addClass('btn-analysis-back')
  .removeClass('btn-back');
$('.btn-analysis-back').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-home').fadeIn(500);
    $('.btn-match-schedule, .btn-team-lookup, .btn-projections, .btn-pit-data, .btn-rankings, .btn-picklist').removeClass('active');
  });
});
scout.import();

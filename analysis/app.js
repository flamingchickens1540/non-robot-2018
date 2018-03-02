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
  data.push(JSON.parse(fs.readFileSync('data/' + manifest[i])));
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
  totTeams.push(data[i].team);
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
if (!fs.existsSync('notes/')) {
  fs.mkdirSync('notes/');
}
var notefest = JSON.parse(fs.readFileSync('notes/manifest.json', 'utf8'));
var notes = [];
for (var i = 0; i < notefest.length; i++) {
  notes.push(JSON.parse(fs.readFileSync('notes/' + notefest[i], 'utf8')));
};
if (!fs.existsSync('seventh/')) {
  fs.mkdirSync('seventh/');
}
var seventhfest = JSON.parse(fs.readFileSync('seventh/manifest.json', 'utf8'));
var seventh = [];
for (var i = 0; i < seventhfest.length; i++) {
  seventh.push(JSON.parse(fs.readFileSync('seventh/' + seventhfest[i], 'utf8')));
  seventh[i].teams = sched[parseInt(seventh[i].match)];
};
// Functions
String.prototype.titleCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
function analyzeTags(a) {
  var teamInfo = [];
  var matches;
  var switching = [];
  var scaling = [];
  var exchanging = [];
  var defending = [];
  var total = [];
  var switchAvg = 0;
  var scaleAvg = 0;
  var exchangeAvg = 0;
  var defenseAvg = 0;
  var totAvg = 0;
  var tags = [];
  var returnArray = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].team == a) {
      teamInfo.push(data[i]);
    }
  };
  matches = teamInfo.length;
  for (var i = 0; i < teamInfo.length; i++) {
    switching[i] =
      parseInt(teamInfo[i].switchAuto) +
      (teamInfo[i]['role'].indexOf('r') >= 0 ? parseInt(teamInfo[i].redSwitch) : parseInt(teamInfo[i].blueSwitch));
    scaling[i] =
      parseInt(teamInfo[i].scaleAuto) +
      parseInt(teamInfo[i].scale);
    exchanging[i] = 0;
    for (var j = 0; j < (teamInfo[i]['role'].indexOf('r') >= 0 ? teamInfo[i].redExchange : teamInfo[i].blueExchange).length; j++) {
      if ((teamInfo[i]['role'].indexOf('r') >= 0 ? teamInfo[i]['redExchange'][j] : teamInfo[i]['blueExchange'][j]) == 'place') {
        exchanging[i]++;
      }
    }
    exchanging[i] += parseInt(teamInfo[i].exchangeAuto);
    defending[i] = (teamInfo[i]['role'].indexOf('r') >= 0 ? parseInt(teamInfo[i].blueSwitch) : parseInt(teamInfo[i].redSwitch));
    total[i] = switching[i] + scaling[i] + exchanging[i] + defending[i];
  };
  for (var i = 0; i < switching.length; i++) {
    switchAvg += switching[i];
  };
  switchAvg /= switching.length;
  for (var i = 0; i < scaling.length; i++) {
    scaleAvg += scaling[i];
  };
  scaleAvg /= scaling.length;
  for (var i = 0; i < exchanging.length; i++) {
    exchangeAvg += exchanging[i];
  };
  exchangeAvg /= exchanging.length;
  for (var i = 0; i < defending.length; i++) {
    defenseAvg += defending[i];
  };
  defenseAvg /= defending.length;
  for (var i = 0; i < total.length; i++) {
    totAvg += total[i];
  };
  totAvg /= total.length;
  if (false) { // NOTE: NEED TO IMPLEMENT FUTZING CODE
    tags.push('Futzer');
  } else {
    if (switchAvg / totAvg > baseline) {
      tags.push('Switcher');
    }
    if (scaleAvg / totAvg > baseline) {
      tags.push('Scaler');
    }
    if (exchangeAvg / totAvg > baseline) {
      tags.push('Exchanger');
    }
    if (defenseAvg / totAvg > baseline) {
      tags.push('Defender');
    }
  }
  returnArray = [tags, [switchAvg, scaleAvg, exchangeAvg, defenseAvg, totAvg]];
  return returnArray;
};
function getTags(a) {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  return tags[a];
};
function analyzeRank() {
 var teamCycleAvg = {};
 var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
 var switchers = [];
 var scalers = [];
 var exchangers = [];
 var defenders = [];
 var newAvg = {};
 for (var i = 0; i < cycle.length; i++) {
   var avg = {};
   for (var attr in cycle[i]) {
     if (cycle[i].hasOwnProperty(attr)) {
       if (attr != 'team') {
         avg[attr] = 0;
         for (var j = 0; j < cycle[i][attr].length; j++) {
           avg[attr] += cycle[i][attr][j];
           if (j + 1 == cycle[i][attr].length) {
             avg[attr] /= j + 1;
           }
         };
       }
     }
   };
   teamCycleAvg[cycle[i].team] = avg;
 };
 for (var team in teamCycleAvg) {
   if (teamCycleAvg.hasOwnProperty(team)) {
     for (var tag in teamCycleAvg[team]) {
       if (teamCycleAvg[team].hasOwnProperty(tag)) {
         newAvg[team] = newAvg[team] == undefined ? {} : newAvg[team];
         switch (tag) {
           case 'switch':
             if (tags[team].indexOf('Switcher') >= 0) {
               switchers.push(teamCycleAvg[team]['switch']);
               newAvg[team]['switch'] = teamCycleAvg[team]['switch'];
             }
             break;
           case 'scale':
             if (tags[team].indexOf('Scaler') >= 0) {
               scalers.push(teamCycleAvg[team]['scale']);
               newAvg[team]['scale'] = teamCycleAvg[team]['scale'];
             }
             break;
           case 'exchange':
             if (tags[team].indexOf('Exchanger') >= 0) {
               exchangers.push(teamCycleAvg[team]['exchange']);
               newAvg[team]['exchange'] = teamCycleAvg[team]['exchange'];
             }
             break;
           case 'defense':
             if (tags[team].indexOf('Defender') >= 0) {
               defenders.push(teamCycleAvg[team]['defense']);
               newAvg[team]['defense'] = teamCycleAvg[team]['defense'];
             }
             break;
         };
       }
     };
   }
 };
 switchers.sort(function (a, b) {return a - b;});
 scalers.sort(function (a, b) {return a - b;});
 exchangers.sort(function (a, b) {return a - b;});
 defenders.sort(function (a, b) {return a - b;});
 for (var team in newAvg) {
   if (newAvg.hasOwnProperty(team)) {
     for (var tag in newAvg[team]) {
       if (newAvg[team].hasOwnProperty(tag)) {
         switch (tag) {
           case 'switch':
             for (var i = 0; i < switchers.length; i++) {
               if (switchers[i] == newAvg[team]['switch']) {
                 newAvg[team]['switch'] = [i + 1, newAvg[team]['switch']];
               }
             };
             break;
           case 'scale':
             for (var i = 0; i < scalers.length; i++) {
               if (scalers[i] == newAvg[team]['scale']) {
                 newAvg[team]['scale'] = [i + 1, newAvg[team]['scale']];
               }
             };
             break;
           case 'exchange':
             for (var i = 0; i < exchangers.length; i++) {
               if (exchangers[i] == newAvg[team]['exchange']) {
                 newAvg[team]['exchange'] = [i + 1, newAvg[team]['exchange']];
               }
             };
             break;
           case 'defense':
             for (var i = 0; i < defenders.length; i++) {
               if (defenders[i] == newAvg[team]['defense']) {
                 newAvg[team]['defense'] = [i + 1, newAvg[team]['defense']];
               }
             };
             break;
         };
       }
     };
   }
 };
 return newAvg;
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
      <tbody class="` + a + `-tbody"></tbody>
    </table>
  `);
  for (var i = 0; i < totTeams.length; i++) {
    for (var team in rankings) {
      if (rankings.hasOwnProperty(team)) {
        if (rankings[team][a] != undefined && rankings[team][a][0] == i + 1) {
          $('.' + a + '-tbody').append(`
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
      <div class="modal-dialog" role="document">
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
function parseExchange(a) {
  var load = 0;
  var place = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i] == 'load') {
      load[i]++;
    } else {
      place++;
    }
  };
  return 'Load: ' + load + ', Place: ' + place;
};
function matchDisplay(a) {
  var tempNotes = [];
  var seventhNotes = [];
  var index = 0;
  for (var i = 0; i < notes.length; i++) {
    if (notes[i][$('.lookup-team').text()] != undefined) {
      tempNotes.push(' ' + notes[i][$('.lookup-team').text()]);
    }
  };
  for (var i = 0; i < seventh.length; i++) {
    var teamVal = seventh[i]['teams'].indexOf($('.lookup-team').text());
    seventhNotes.push([teamVal <= 2 ? seventh[i]['redswitch-' + teamVal] : seventh[i]['blueswitch-' + teamVal], seventh[i]['scale-' + teamVal], teamVal >= 3 ? seventh[i]['redswitch-' + teamVal] : seventh[i]['blueswitch-' + teamVal]]);
  };

  for (var i = 0; i < data.length; i++) {
    if (data[i].team == $('.lookup-team').text()) {
      switch (a) {
        case 'hswitch':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + data[i].switchAuto + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? data[i].redSwitch : data[i].blueSwitch) + `</td>
            </tr>
          `);
          break;
        case 'oswitch':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? data[i].blueSwitch : data[i].redSwitch) + `</td>
            </tr>
          `);
          break;
        case 'hplatform':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? data[i].redPlatformCube : data[i].bluePlatformCube) + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? data[i]['redPlatform'].titleCase() : data[i]['bluePlatform'].titleCase()) + `</td>
              <td>` + data[i].climbNotes + `</td>
            </tr>
          `);
          break;
        case 'oplatform':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
            </tr>
          `);
          break;
        case 'scale':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + data[i].scaleAuto + `</td>
              <td>` + data[i].scale + `</td>
            </tr>
          `);
          break;
        case 'exchange':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + data[i].exchangeAuto + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? parseExchange(data[i].redExchange) : parseExchange(data[i].blueExchange)) + `</td>
            </tr>
          `);
          break;
        case 'portal':
          $('.' + a + '-tbody').append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + (data[i]['role'].indexOf('r') >= 0 ? data[i].redPortal : data[i].bluePortal) + `</td>
            </tr>
          `);
          break;
        case 'notes':
          $('.lookup-' + a).append(`
            <tr>
              <td>` + data[i].match + `</td>
              <td>` + scouts[data[i].scout] + `</td>
              <td>` + data[i].notes + `</td>
              <td>` + tempNotes + `</td>
              <td>` + (seventhNotes[index][0] == undefined ? 0 : seventhNotes[0][0]) + `</td>
              <td>` + (seventhNotes[index][1] == undefined ? 0 : seventhNotes[0][1]) + `</td>
              <td>` + (seventhNotes[index][2] == undefined ? 0 : seventhNotes[0][2]) + `</td>
            </tr>
          `);
          index++;
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
        "team":"N/A",
        "scout":"N/A",
        "phone":"N/A",
        "occupation":"N/A",
        "switchAuto":"N/A",
        "scaleAuto":"N/A",
        "exchangeAuto":"N/A",
        "twoCubeAuto":"N/A",
        "lineAuto":"N/A",
        "robotRole":["N/A"],
        "robotRoleNotes":"N/A",
        "climb":"N/A",
        "climbNotes":"N/A",
        "cubeLoad":["N/A"],
        "lang":"N/A",
        "driveTrain":"N/A",
        "weight":"N/A",
        "notes":"N/A"
      };
      if (pit[$(this).val()] == undefined) {
        pit[$(this).val()] = {};
      }
      for (var i in template) {
        if (template.hasOwnProperty(i)) {
          if (pit[$(this).val()][i] == undefined) {
            pit[$(this).val()][i] = 'N/A';
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
              ` + modal('exchange', true) + `
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
                  <th scope="col">Stand App Notes</th>
                  <th scope="col">Notes App Notes</th>
                  <th scope="col">Seventh Scout - Switch</th>
                  <th scope="col">Seventh Scout - Scale</th>
                  <th scope="col">Seventh Scout - Defense</th>
                </tr>
              </thead>
              <tbody class="lookup-notes"></tbody>
            </table>
            <br>
            <br>
            <button class="btn btn-danger">Average Cubes: ` + teamCubeData[$(this).val()][4] + `</button>
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
                      + card('Phone Number', pit[$(this).val()]['phone'] + ` (` + (pit[$(this).val()]['occupation'] == 'true' ? 'Mentor' : 'Student') + `)`)
                      + card('Scale Auto', pit[$(this).val()]['scaleAuto'])
                      + card('Climb', (pit[$(this).val()]['climb'] == 'false' ? 'No Climb :(' : pit[$(this).val()]['climb'].titleCase()))
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
          $('.analysis-tags').append('<button class="btn btn-outline-info">' + lookupTags[i] + ' - ' + rankings[$('.lookup-team').text()][temp][0] + '</button>&nbsp;&nbsp;&nbsp;');
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
          type: 'error'
        }).show();
      }
    }
    $('.hswitch-tbody').append(matchDisplay('hswitch'));
    $('.oswitch-tbody').append(matchDisplay('oswitch'));
    $('.hplatform-tbody').append(matchDisplay('hplatform'));
    $('.oplatform-tbody').append(matchDisplay('oplatform'));
    $('.scale-tbody').append(matchDisplay('scale'));
    $('.exchange-tbody').append(matchDisplay('exchange'));
    $('.portal-tbody').append(matchDisplay('portal'));
    $('.lookup-notes').append(matchDisplay('notes'));
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
$('.picklist-table')
  .sortable()
  .disableSelection()
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

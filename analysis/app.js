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
if (!fs.existsSync('pit-data')) {
  fs.mkdirSync('pit-data');
}

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
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  var switchers = [];
  var scalers = [];
  var exchangers = [];
  var defenders = [];
  var switchCube = {};
  var scaleCube = {};
  var exchangeCube = {};
  var defenseCube = {};
  var switchSort = [];
  var scaleSort = [];
  var exchangeSort = [];
  var defenseSort = [];
  var rankings = {};
  for (var team in tags) {
    if (tags.hasOwnProperty(team)) {
      for (var i = 0; i < tags[team].length; i++) {
        if (tags[team][i] == 'Switcher') {
          switchers.push(team);
        }
        if (tags[team][i] == 'Scaler') {
          scalers.push(team);
        }
        if (tags[team][i] == 'Exchanger') {
          exchangers.push(team);
        }
        if (tags[team][i] == 'Defender') {
          defenders.push(team);
        }
      };
    }
  };
  rankings.switch = rankHelper(switchers, switchCube, switchSort, 'switch');
  rankings.scale = rankHelper(scalers, scaleCube, scaleSort, 'scale');
  rankings.exchange = rankHelper(exchangers, exchangeCube, exchangeSort, 'exchange');
  rankings.defense = rankHelper(defenders, defenseCube, defenseSort, 'oswitch');
  return rankings;
};
function rankHelper(a, b, c, d) {
  var cubes = JSON.parse(fs.readFileSync('resources/team-cube-data.json', 'utf8'));
  var previous;
  var ties = {};
  var avgCycleTime = {};
  for (var i = 0; i < a.length; i++) {
    for (var teamData in cycle) {
      if (cycle.hasOwnProperty(teamData)) {
        if (cycle[teamData].team == a[i]) {
          b[a[i]] = [cycle[teamData][d]];
        }
      }
    };
  };
  for (var teamNum in b) {
    if (b.hasOwnProperty(teamNum)) {
      for (var i = 0; i < b[teamNum].length; i++) {
        avgCycleTime[teamNum] = avgCycleTime[teamNum] == undefined ? 0 : avgCycleTime[teamNum];
        avgCycleTime[teamNum] += b[teamNum][0][i];
      };
      avgCycleTime[teamNum] /= b[teamNum][0].length;
      c.push(avgCycleTime[teamNum]);
    }
  };
  c.sort(function(a, b) {return a - b});
  for (var teamNum in avgCycleTime) {
    if (avgCycleTime.hasOwnProperty(teamNum)) {
      if (previous != undefined && avgCycleTime[teamNum] == avgCycleTime[previous]) {
        ties[avgCycleTime[teamNum]] = typeof ties[avgCycleTime[teamNum]] != 'object' ? [] : ties[avgCycleTime[teamNum]];
        ties.push(teamNum, previous);
      }
      previous = teamNum;
    }
  };
  for (var i = 0; i < c.length; i++) {
    for (var teamNum in b) {
      if (b.hasOwnProperty(teamNum)) {
        if (c[i] == avgCycleTime[teamNum]) {
          b[teamNum][1] = i + 1;
        }
      }
    };
  };
  if (Object.keys(ties).length > 0) {
    for (var cubeNum in ties) {
      if (ties.hasOwnProperty(cubeNum)) {
        for (var i = 0; i < ties[cubeNum].length; i++) {
          if (ties[cubeNum][i + 1] != undefined) {
            if (cubes[ties[cubeNum][i]][4] > cubes[ties[cubeNum][i + 1]][4]) {
              b[ties[cubeNum][i]][1]--;
            } else {
              b[ties[cubeNum][i + 1]][1]--;
            }
          }
        };
      }
    };
  }
  return b;
};
function displayRank(a, b) {
  var rankedTeam = 0;
  previousTeamRank.switch = 0;
  previousTeamRank.scale = 0;
  previousTeamRank.exchange = 0;
  previousTeamRank.defense = 0;
  $('.cell-rankings-' + b).html(`
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Team</th>
        </tr>
      </thead>
      <tbody class="team-rank-table-` + a + `"></tbody>
    </table>
  `);
  for (var teamNum in rankings[a]) {
    if (rankings[a].hasOwnProperty(teamNum)) {
      previousTeamRank[a]++;
      if (previousTeamRank[a] != rankings[a][teamNum][1]) {
        for (var i = 0; i < totTeams.length; i++) {
          if (rankings[a][totTeams[i]][1] == previousTeamRank[a]) {
            rankedTeam = totTeams[i];
            break;
          } else {
            rankedTeam = 0;
          }
        };
      }
      $('.team-rank-table-' + a).append(`
        <tr class="btn-rank-team rank-` + a + `-` + (rankedTeam == '0' ? teamNum : rankedTeam) + `">
          <td class="` + a + `-rank">` + rankings[a][rankedTeam == '0' ? teamNum : rankedTeam][1] + `</td>
          <td class="` + a + `-team btn-team">` + (rankedTeam == '0' ? teamNum : rankedTeam) + `</td>
        </tr>
      `);
    }
  };
  return a;
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
            </tr>
          `);
          break;
      }
    }
  };
};
function pit() {
  var pit = [];
  var pitfest = JSON.parse(fs.readFileSync('pit-data/manifest.json', 'utf8'));
  for (var i = 0; i < pitfest.length; i++) {
    var tempPit = JSON.parse(fs.readFileSync('pit-data/' + pitfest[i], 'utf8'));
    if (tempPit.team != undefined) {
      pit.push(tempPit);
    }
  };
  $('.cell-pit-data-1')
    .html(`
      <table class="table table-hover">
        <thead>
          <tr>
            <th style="position: sticky; left: -1.5vw; width: 6em; background: white;">Team</th>
            <th style="white-space: nowrap;">Scout</th>
            <th style="white-space: nowrap;">Phone Number</th>
            <th style="white-space: nowrap;">Left Auto</th>
            <th style="white-space: nowrap;">Mid Auto</th>
            <th style="white-space: nowrap;">Right Auto</th>
            <th style="white-space: nowrap;">Preferred Role</th>
            <th style="white-space: nowrap;">Notes</th>
            <th style="white-space: nowrap;">Climb Type</th>
            <th style="white-space: nowrap;">Notes</th>
            <th style="white-space: nowrap;">Cube Load Method</th>
            <th style="white-space: nowrap;">Cube Load Location</th>
            <th style="white-space: nowrap;">Robot Code Language</th>
            <th style="white-space: nowrap;">Drive Train</th>
            <th style="white-space: nowrap;">Weight</th>
          </tr>
        </thead>
        <tbody class="pit-table"></tbody>
      </table>
    `)
    .css({'width': '90vw', 'overflow-x': 'scroll'})
    .parent().after('<br><br>');
  for (var i = 0; i < pit.length; i++) {
    var pitKey = Object.keys(pit[i]);
    var left = [];
    var mid = [];
    var right = [];
    for (var j = 0; j < pitKey.length; j++) {
      if (typeof pit[i][pitKey[j]] == 'object') {
        if (pit[i][pitKey[j]].indexOf('Left Auto') >= 0) {
          switch (pitKey[j]) {
            case 'leftSwitchAuto':
              left.push(' Left Switch');
              break;
            case 'rightSwitchAuto':
              left.push(' Right Switch');
              break;
            case 'leftScaleAuto':
              left.push(' Left Scale');
              break;
            case 'rightScaleAuto':
              left.push(' Right Scale');
              break;
            case 'twoCubeAuto':
              left.push(' Two Cube');
              break;
            case 'exchangeAuto':
              left.push(' Exchange');
              break;
            case 'lineAuto':
              left.push(' Cross Line');
              break;
          };
        }
        if (pit[i][pitKey[j]].indexOf('Mid Auto') >= 0) {
          switch (pitKey[j]) {
            case 'leftSwitchAuto':
              mid.push(' Left Switch');
              break;
            case 'rightSwitchAuto':
              mid.push(' Right Switch');
              break;
            case 'leftScaleAuto':
              mid.push(' Left Scale');
              break;
            case 'rightScaleAuto':
              mid.push(' Right Scale');
              break;
            case 'twoCubeAuto':
              mid.push(' Two Cube');
              break;
            case 'exchangeAuto':
              mid.push(' Exchange');
              break;
            case 'lineAuto':
              mid.push(' Cross Line');
              break;
          };
        }
        if (pit[i][pitKey[j]].indexOf('Right Auto') >= 0) {
          switch (pitKey[j]) {
            case 'leftSwitchAuto':
              right.push(' Left Switch');
              break;
            case 'rightSwitchAuto':
              right.push(' Right Switch');
              break;
            case 'leftScaleAuto':
              right.push(' Left Scale');
              break;
            case 'rightScaleAuto':
              right.push(' Right Scale');
              break;
            case 'twoCubeAuto':
              right.push(' Two Cube');
              break;
            case 'exchangeAuto':
              right.push(' Exchange');
              break;
            case 'lineAuto':
              right.push(' Cross Line');
              break;
          };
        }
      }
    };
    if (pit[i]['cubeLoad'] != undefined && typeof pit[i]['cubeLoad'] == 'object') {
      for (var j = 0; j < pit[i]['cubeLoad'].length; j++) {
        pit[i]['cubeLoad'][j] = ' ' + pit[i]['cubeLoad'];
      };
    }
    $('.pit-table').append(`
      <tr>
        <td style="position: sticky; left: -1.5vw; width: 6em; background: white;">` + pit[i].team + `</td>
        <td style="white-space: nowrap;">` + scouts[pit[i].scout] + `</td>
        <td style="white-space: nowrap;">` + pit[i].phone + ' (' + (JSON.parse(pit[i].occupation) ? 'Mentor': 'Student') + `)</td>
        <td style="white-space: nowrap;">` + left + `</td>
        <td style="white-space: nowrap;">` + mid + `</td>
        <td style="white-space: nowrap;">` + right + `</td>
        <td style="white-space: nowrap;">` + pit[i].robotRole + `</td>
        <td style="white-space: nowrap;">` + pit[i].robotRoleNotes + `</td>
        <td style="white-space: nowrap;">` + (pit[i]['climb'] == 'false' ? 'No Climb :(' : pit[i]['climb'].titleCase()) + `</td>
        <td style="white-space: nowrap;">` + pit[i].climbNotes + `</td>
        <td style="white-space: nowrap;">` + pit[i].cubeLoadMethod + `</td>
        <td style="white-space: nowrap;">` + pit[i].cubeLoad + `</td>
        <td style="white-space: nowrap;">` + pit[i].lang + `</td>
        <td style="white-space: nowrap;">` + pit[i].driveTrain + `</td>
        <td style="white-space: nowrap;">` + pit[i].weight + `</td>
      </tr>
    `);
  };
};

// Home
scout.page('Home', [3, 3, 3, 3]);
scout.checkbox('.cell-home-1', '', [{text: 'Match Schedule', color: 'primary'}], 'asdf', false, 'btn-home btn-match-schedule');
scout.checkbox('.cell-home-2', '', [{text: 'Team Lookup', color: 'primary'}], 'asdf', false, 'btn-home btn-team-lookup');
scout.checkbox('.cell-home-3', '', [{text: 'Pit Data', color: 'primary'}], 'asdf', false, 'btn-home btn-pit-data');
scout.checkbox('.cell-home-4', '', [{text: 'Rankings', color: 'primary'}], 'asdf', false, 'btn-home btn-rankings');
scout.checkbox('.cell-home-1', '', [{text: 'Picklist', color: 'primary'}], 'asdf', false, 'btn-home btn-picklist');
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
$('.btn-pit-data').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-pit-data').fadeIn(500);
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
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody class="lookup-notes"></tbody>
            </table>
            <br>
            <br>
            <button class="btn btn-danger">Average Cubes: ` + teamCubeData[$(this).val()][4] + `</button>
            <button class="btn btn-danger">Average Climb Rate (w/ Levitate): <span class="climb-rate-avg-lev"></span></button>
            <button class="btn btn-danger">Average Climb Rate (w/o Levitate): <span class="climb-rate-avg"></span></button>
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
          $('.analysis-tags').append('<button class="btn btn-outline-info">' + lookupTags[i] + ' - ' + rankings[temp][$('.lookup-team').text()][1] + '</button>&nbsp;&nbsp;&nbsp;');
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

// Pit Data
scout.page('Pit Data', [12]);
pit();

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

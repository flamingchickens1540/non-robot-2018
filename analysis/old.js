function analyzeTags(a, b, c) {
  var teamInfo = b;
  var teamData = {};
  var exchangeLoadCount = 0;
  var primTags = [];
  var tempData = {};
  var matchesPlayed = 0;
  for (var i = 0; i < teamInfo.length; i++) {
    tempData.switch = parseInt(teamInfo[i].switchAuto) + (teamInfo[i]['role'].indexOf('r') >= 0 ? parseInt(teamInfo[i].redSwitch) : parseInt(teamInfo[i].blueSwitch));
    tempData.scale = parseInt(teamInfo[i].scaleAuto) + parseInt(teamInfo[i].scale);
    for (var j = 0; j < (teamInfo[i]['role'].indexOf('r') >= 0 ? teamInfo[i].redExchange : teamInfo[i].blueExchange).length; j++) {
      if ((teamInfo[i]['role'].indexOf('r') >= 0 ? teamInfo[i]['redExchange'][j] : teamInfo[i]['blueExchange'][j]) == 'place') {
        exchangeLoadCount++;
      }
    }
    tempData.exchange = parseInt(teamInfo[i].exchangeAuto) + exchangeLoadCount;
    tempData.defense = (teamInfo[i]['role'].indexOf('r') >= 0 ? parseInt(teamInfo[i].blueSwitch) : parseInt(teamInfo[i].redSwitch));
    matchesPlayed++;
  }
  teamData.matches = matchesPlayed;
  teamData.switch = Math.floor(tempData.switch / matchesPlayed);
  teamData.scale = Math.floor(tempData.scale / matchesPlayed);
  teamData.exchange = Math.floor(tempData.exchange / matchesPlayed);
  teamData.defense = Math.floor(tempData.defense / matchesPlayed);
  tempData.concat = {};
  tempData.concat.switch = teamData.switch;
  tempData.concat.scale = teamData.scale;
  tempData.concat.exchange = teamData.exchange;
  tempData.concat.defense = teamData.defense;
  teamData.tag = teamData['tag'] == undefined ? [] : teamData.tag;
  master.teams = master['teams'] == undefined ? [] : master.teams;
  if (master['teams'].indexOf(a) < 0) {
    master['teams'].push(a);
    master.switch = master.switch == undefined ? Math.round(parseInt(teamData.switch) / master['teams'].length) : Math.round((parseInt(master.switch) + parseInt(teamData.switch)) / master['teams'].length);
    master.scale = master.scale == undefined ? Math.round(parseInt(teamData.scale) / master['teams'].length) : Math.round((parseInt(master.scale) + parseInt(teamData.scale)) / master['teams'].length);
    master.exchange = master.exchange == undefined ? Math.round(parseInt(teamData.exchange) / master['teams'].length) : Math.round((parseInt(master.exchange) + parseInt(teamData.exchange)) / master['teams'].length);
    master.defense = master.defense == undefined ? Math.round(parseInt(teamData.defense) / master['teams'].length) : Math.round((parseInt(master.defense) + parseInt(teamData.defense)) / master['teams'].length);
  }
  if (teamData.switch < master.switch && teamData.scale < master.scale && teamData.exchange < master.exchange && teamData.defense < master.defense) {
    teamData['tag'].indexOf('Futzer') >= 0 ? '' : teamData['tag'].push('Futzer');
    tags.push('Futzer');
  } else {
    for (var avg in tempData['concat']) {
      if (tempData['concat'].hasOwnProperty(avg)) {
        if (tempData['concat'][avg] / (teamData.switch + teamData.scale + teamData.exchange + teamData.defense) > 0.25) {
          primTags.push(avg);
        }
      }
    };
  }
  analysisManifest.push('analysis-' + a + '.json');
  if (c) {
    saveAnalysis(a, teamData, master, analysisManifest);
  }
}
function saveAnalysis(a, b, c, d) {
  fs.writeFileSync('export/manifest.json', JSON.stringify(d));
  fs.writeFileSync('export/master.json', JSON.stringify(c));
  fs.writeFileSync('export/analysis-' + a + '.json', JSON.stringify(b));
}
//
//
//
var analyzeTeam = [];
var lookupTags = [];
for (var i = 0; i < data.length; i++) {
  if ($(this).val() == data[i].team) {
    analyzeTeam.push(data[i]);
  }
};
if (analyzeTeam.length == 0) {
  new Noty({
    text: 'This team is not competing at this event, or maybe they\'re an FLL team.',
    type: 'error'
  }).show();
}
lookupTags = getTags($(this).val());
for (var i = 0; i < lookupTags.length; i++) {
  $('.analysis-tags').append('<button class="btn btn-outline-info">' + lookupTags[i] + '</button>');
}
//
//
//
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(
    mergeSort(left),
    mergeSort(right)
  );
};
function merge(left, right) {
  let result = [];
  let indexLeft = 0;
  let indexRight = 0;
  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] < right[indexRight]) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }
  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
};
//
//
//
function analyzePicklist() {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  var chicken = {};
  var pick = {};
  for (var i = 0; i < tags[1540].length; i++) {
    switch (tags[1540][i]) {
      case 'Switcher':
        chicken.switch = rankings['switch'][1540][1];
        break;
      case 'Scaler':
        chicken.scale = rankings['scale'][1540][1];
        break;
      case 'Exchanger':
        chicken.exchange = rankings['exchange'][1540][1];
        break;
      case 'Defender':
        chicken.defense = rankings['defense'][1540][1];
        break;
    };
  };
  for (var i = 0; i < alliance.length; i++) {
    pick[alliance[i]] = picklistHelper(alliance[i]);
  };
  console.log(pick);
  $('.picklist-table').append(`
    <tr>
      <td></td>
    </tr>
  `);
};
function picklistHelper(a) {
  var temp = [];
  for (var i = 0; i < Object.keys(rankings[a]).length; i++) {
    $.each(rankings[a], function (k, v) {
      if (v[1] == i + 1) {
        temp.push(k);
      }
    });
  };
  return temp;
};
//
//
//
// Picklist
scout.page('Picklist', [12]);
$('.cell-picklist-1').html(`
  <table class="table table-hover">
    <thead>
      <th>#</th>
      <th>` + alliance[0].upperFirstLetter() + `</th>
      <th>` + alliance[1].upperFirstLetter() + `</th>
      <th>` + alliance[2].upperFirstLetter() + `</th>
      <th>` + alliance[3].upperFirstLetter() + `</th>
    </thead>
    <tbody class="picklist-table"></tbody>
  </table>
`);
//
//
//
$('.team-pick').click(function () {
  $(this)
    .css('background', 'lightblue')
    .keydown(function () {
      switch (event.keyCode) {
        case 38:
          $(this)
            .insertBefore($(this).prev())
            .focus();
          break;
        case 40:
          $(this)
            .insertAfter($(this).next())
            .focus();
          break;
        case 13:
          $(this)
            .css('background', '')
            .blur();
          break;
      };
    });
});
//
//
//
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
//
//
//
function analyzeRank() {
  var tags = JSON.parse(fs.readFileSync('export/tags.json', 'utf8'));
  var switchers = [];
  var scalers = [];
  var exchangers = [];
  var defenders = [];
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
  rankings.switch = rankHelper(switchers, 'switch');
  rankings.scale = rankHelper(scalers, 'scale');
  rankings.exchange = rankHelper(exchangers, 'exchange');
  rankings.defense = rankHelper(defenders, 'oswitch');
  fs.writeFileSync('export/rankings.json', JSON.stringify(rankings));
  return rankings;
};
function rankHelper(a, b, c, d) {
  var b = {};
  var c = [];
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
//
//
//

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
//
//
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
           case 'redswitch':
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
           case 'blueswitch':
             if (tags[team].indexOf('Defender') >= 0) {
               defenders.push(teamCycleAvg[team]['blueswitch']);
               newAvg[team]['defense'] = teamCycleAvg[team]['blueswitch'];
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
 fs.writeFileSync('export/rankings.json', JSON.stringify(newAvg));
 return newAvg;
};

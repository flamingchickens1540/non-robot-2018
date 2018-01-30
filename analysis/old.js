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

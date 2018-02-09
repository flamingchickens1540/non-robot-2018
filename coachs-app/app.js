// Require
window.jQuery = window.$ = require('jquery');
const scout = require('scouting');
const fs = require('fs-extra');

// Initialization
var noMatch = true;
var matches = [];
var matchNum = 0;
var rankings;
var tags;
var avg = 0;
var teamAvg = {};
var prediction = [0, 0];
var sched =
  fs.existsSync('scouting/schedule.json') ?
    JSON.parse(fs.readFileSync('scouting/schedule.json')) :
    new Noty({
      text: 'No Schedule',
      type: 'error'
    }).show();
for (var num in sched) {
  if (sched.hasOwnProperty(num)) {
    for (var i = 0; i < 6; i++) {
      if (sched[num][i] == '1540') {
        matches.push(num);
      }
    };
  }
};
if (fs.existsSync('data/rankings.json')) {
  rankings = JSON.parse(fs.readFileSync('data/rankings.json', 'utf8'));
}
if (fs.existsSync('data/tags.json')) {
  tags = JSON.parse(fs.readFileSync('data/tags.json', 'utf8'));
}
for (var team in tags) {
  if (tags.hasOwnProperty(team)) {
    for (var i = 0; i < tags[team].length; i++) {
      if (i > 0) {
        tags[team][i] = ' ' + tags[team][i];
      }
    };
  }
};
for (var attr in rankings) {
  if (rankings.hasOwnProperty(attr)) {
    for (var team in rankings[attr]) {
      if (rankings[attr].hasOwnProperty(team)) {
        for (var i = 0; i < rankings[attr][team][0].length; i++) {
          rankings[attr][team][0][i] /= 1000;
          avg += rankings[attr][team][0][i];
          rankings[attr][team][0][i] = ' ' + rankings[attr][team][0][i] + 's';
          if (i + 1 == rankings[attr][team][0].length) {
            avg /= (i + 1);
            rankings[attr][team][2] = parseFloat(avg).toFixed(3) + 's';
            if (teamAvg[team] == undefined) {
              teamAvg[team] = {};
            }
            teamAvg[team][attr] = parseFloat(avg).toFixed(3);
            avg = 0;
          }
        };
      }
    };
  }
};
scout.init('blank', false);
$(document).ready(function () {
  $('.btn-next').remove();
  $('.btn-back').click(function () {
    $('.page-pane').fadeOut(250, function () {
      $('.body-div-home').fadeIn(500);
      $('.btn-match-preview, .btn-team-lookup').removeClass('active');
    });
  });
});
function card(a, b) {
  return (`
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <h5 class="card-title">` + a + `</h5>
        <p class="card-text">` + b + `</p>
      </div>
    </div>
    <br>
  `);
};
function match() {
  var temp = [0, 0, 0, 0, 0, 0];
  var index = 0;
  prediction = [0, 0];
  scout.radio('.cell-match-preview-2-1', '', [{text: sched[matches[matchNum]][0], color: 'danger', class: 'btn-teams'}], 'asdf', false);
  scout.radio('.cell-match-preview-2-1', '', [{text: sched[matches[matchNum]][1], color: 'danger', class: 'btn-teams'}], 'asdf', false);
  scout.radio('.cell-match-preview-2-1', '', [{text: sched[matches[matchNum]][2], color: 'danger', class: 'btn-teams'}], 'asdf', false);
  scout.radio('.cell-match-preview-2-3', '', [{text: sched[matches[matchNum]][3], color: 'primary', class: 'btn-teams'}], 'asdf', false);
  scout.radio('.cell-match-preview-2-3', '', [{text: sched[matches[matchNum]][4], color: 'primary', class: 'btn-teams'}], 'asdf', false);
  scout.radio('.cell-match-preview-2-3', '', [{text: sched[matches[matchNum]][5], color: 'primary', class: 'btn-teams'}], 'asdf', false);
  for (var i = 0; i < sched[matches[matchNum]].length; i++) {
    for (var attr in teamAvg[sched[matches[matchNum]][i]]) {
      if (teamAvg[sched[matches[matchNum]][i]].hasOwnProperty(attr)) {
        temp[i] += parseInt(teamAvg[sched[matches[matchNum]][i]][attr]);
        index++;
      }
    };
    if (teamAvg[sched[matches[matchNum]][i]] != undefined) {
      temp[i] /= Object.keys(teamAvg[sched[matches[matchNum]][i]]).length;
    }
  };
  for (var i = 0; i < temp.length; i++) {
    if (i < 3) {
      if (temp[i] != 0) {
        prediction[0] += Math.floor(135 / temp[i]) - 1;
      }
    } else {
      if (temp[i] != 0) {
        prediction[1] += Math.floor(135 / temp[i]) - 1;
      }
    }
  };
  for (var i = 0; i < prediction.length; i++) {
    prediction[i] = ' ' + prediction[i];
  }
  scout.text('.cell-match-preview-2-2', 'Predicted Cube Count:<br>' + prediction, '24');
};

// Home Page
scout.page('Home', [6, 6]);
scout.checkbox('.cell-home-1', '', [{text: 'Match Preview', color: 'primary', class: 'btn-match-preview'}], 'asdf', false);
scout.checkbox('.cell-home-2', '', [{text: 'Team Lookup', color: 'primary', class: 'btn-team-lookup'}], 'asdf', false);

$('.btn-match-preview').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-match-preview').fadeIn(500);
    $('.btn-teams').removeClass('active');
  });
});
$('.btn-team-lookup').click(function () {
  $('.page-pane').fadeOut(250, function () {
    $('.body-div-team-lookup').fadeIn(500);
  });
});

// Match Preview
scout.page('Match Preview', [12]);
scout.checkbox('.cell-match-preview-1', '', [{text: 'Next Match: ' + matchNum, color: 'warning', class: 'btn-match'}], 'asdf', false);
$(document).ready(function () {
  $('.body-div-match-preview > h1, .body-div-match-preview > br, .body-div-match-preview > hr').remove();
  $('.row-match-preview').after(`
    <div class="row row-match-preview-2">
      <div class="col-sm-4 cell-match-preview-2-1"></div>
      <div class="col-sm-4 cell-match-preview-2-2"></div>
      <div class="col-sm-4 cell-match-preview-2-3"></div>
      <div class="col-sm-12 no-match"></div>
    </div>
  `);
  $('.btn-match').click(function () {
    if (!$(this).hasClass('active')) {
      $(this).text('Current Match: ' + (typeof matchNum == 'string' ? 'No Matches Left' : matches[matchNum]));
    } else {
      matchNum = (matchNum + 1 >= matches.length) || (typeof matchNum == 'string') ? '' : matchNum + 1;
      $(this).text('Next Match: ' + (typeof matchNum == 'string' ? 'No Matches Left' : matches[matchNum]));
      $('.cell-match-preview-2-1, .cell-match-preview-2-2, .cell-match-preview-2-3').empty();
      try {
        match();
      } catch (e) {
        if (noMatch) {
          scout.text('.no-match', 'No Matches Left', 48);
          noMatch = false;
        }
      }
    }
  });
  match();
  $('.btn-teams').click(function () {
    var teamNum = $(this).text();
    $('.page-pane').fadeOut(250, function () {
      $('.body-div-team-lookup').show();
      $('.input-team-lookup > input')
        .val(teamNum)
        .focus();
    });
  });
});

// Team Lookup
scout.page('Team Lookup', [12]);
scout.input('.cell-team-lookup-1', '', '1540', 'asdf', false , 'input-team-lookup');
$('.input-team-lookup').keydown(function () {
  if (event.keyCode == 13) {
    $('.team-info').remove();
    $('.cell-team-lookup-1').after(`
      <div class="team-info" style="width: 100%;">
        <h1 style="text-align: center;">` + $(this).children('input').val() + `</h1>
        <br>
        <div class="row">
          <div class="col-sm-3 info-1">
            ` + card('Tag(s)', tags[$(this).children('input').val()]) + `
          </div>
          <div class="col-sm-3 info-2"></div>
          <div class="col-sm-3 info-3"></div>
          <div class="col-sm-3 info-4"></div>
        </div>
      </div>
    `);
    if (rankings['switch'][$(this).children('input').val()] != undefined) {
      $('.info-2').append(card('Switch Cycle Times', rankings['switch'][$(this).children('input').val()][0] + ' (Avg: ' + rankings['switch'][$(this).children('input').val()][2] + ')'));
    } else {
      $('.info-2').append(card('Switch Cycle Times', 'Not a switch bot'));
    }
    if (rankings['scale'][$(this).children('input').val()] != undefined) {
      $('.info-3').append(card('Scale Cycle Times', rankings['scale'][$(this).children('input').val()][0] + ' (Avg: ' + rankings['scale'][$(this).children('input').val()][2] + ')'));
    } else {
      $('.info-3').append(card('Scale Cycle Times', 'Not a scale bot'));
    }
    if (rankings['exchange'][$(this).children('input').val()] != undefined) {
      $('.info-4').append(card('Exchange Cycle Times', rankings['exchange'][$(this).children('input').val()][0] + ' (Avg: ' + rankings['exchange'][$(this).children('input').val()][2] + ')'));
    } else {
      $('.info-4').append(card('Exchange Cycle Times', 'Not an exchange bot'));
    }
    if (rankings['defense'][$(this).children('input').val()] != undefined) {
      $('.info-1').append(card('Defense Cycle Times', rankings['defense'][$(this).children('input').val()][0] + ' (Avg: ' + rankings['defense'][$(this).children('input').val()][2] + ')'));
    } else {
      $('.info-1').append(card('Defense Cycle Times', 'Not a defense bot'));
    }
    for (var i = 0; i < tags[$(this).children('input').val()].length; i++) {
      switch (tags[$(this).children('input').val()][i]) {
        case 'Switcher':
        case ' Switcher':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Switch Ranking', 'Switch: ' + rankings['switch'][$(this).children('input').val()][1]));
          break;
        case 'Scaler':
        case ' Scaler':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Scale Ranking', 'Scale: ' + rankings['scale'][$(this).children('input').val()][1]));
          break;
        case 'Exchanger':
        case ' Exchange':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Exchange Ranking', 'Exchange: ' + rankings['exchange'][$(this).children('input').val()][1]));
          break;
        case 'Defender':
        case ' Defender':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Defense Ranking', 'Defense: ' + rankings['defense'][$(this).children('input').val()][1]));
          break;
      };
    }
  }
});

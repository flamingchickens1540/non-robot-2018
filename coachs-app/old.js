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
//
//
//
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

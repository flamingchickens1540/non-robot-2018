window.jQuery = window.$ = require('jquery');
var scout = require('scouting');
const fs = require('fs');
var textareaCount = 0;
var isShift;
var sched = JSON.parse(fs.readFileSync('scouting/schedule.json', 'utf8'));
if (!fs.existsSync('scouting/matchNum.txt')) {
  fs.writeFileSync('scouting/matchNum.txt', 1);
}
var matchNum = JSON.parse(fs.readFileSync('scouting/matchNum.txt', 'utf8'));
scout.init('blank', true);
scout.page('Match Notes', [6, 6]);
scout.textarea('.cell-match-notes-1', 'Red 1: ' + sched[matchNum][0], 'Type here...', sched[matchNum][0]);
scout.textarea('.cell-match-notes-1', 'Red 2: ' + sched[matchNum][1], 'Type here...', sched[matchNum][1]);
scout.textarea('.cell-match-notes-1', 'Red 3: ' + sched[matchNum][2], 'Type here...', sched[matchNum][2]);
scout.textarea('.cell-match-notes-2', 'Blue 1: ' + sched[matchNum][3], 'Type here...', sched[matchNum][3]);
scout.textarea('.cell-match-notes-2', 'Blue 2: ' + sched[matchNum][4], 'Type here...', sched[matchNum][4]);
scout.textarea('.cell-match-notes-2', 'Blue 3: ' + sched[matchNum][5], 'Type here...', sched[matchNum][5]);
scout.done('.cell-match-notes-1', false);

$('.scout-t')
  .each(function () {
    textareaCount++;
    $(this).attr('id', 'ta-' + textareaCount);
  })
  .keydown(function () {
    if (event.which != 9) {
      isShift = false;
    }
    if (event.which == 13) {
      event.preventDefault();
      $(this).val($(this).val() + ', ');
    } else if (event.which == 16 || event.which == 9) {
      event.preventDefault();
      if (event.which == 16) {
        isShift = true;
      } else {
        if (parseInt($(this).attr('id').substr(3)) <= 3) {
          $('#ta-' + (parseInt($(this).attr('id').substr(3)) + 3)).focus();
        } else if (parseInt($(this).attr('id').substr(3)) != 6) {
          $('#ta-' + (parseInt($(this).attr('id').substr(3)) - 2)).focus();
        } else {
          $('#ta-1').focus();
        }
        $(this).val($(this).val() + ', ');
      }
      if (isShift && event.which == 9) {
        if (parseInt($(this).attr('id').substr(3)) <= 3) {
          $('#ta-' + (parseInt($(this).attr('id').substr(3)) + 3)).focus();
        } else {
          $('#ta-' + (parseInt($(this).attr('id').substr(3)) - 3)).focus();
        }
        isShift = false;
      }
    }
  });

$(document).ready(function () {
  setTimeout(function () {
    $('.filename')
      .val(matchNum)
      .focus();
  }, 100);
  $('.btn-done')
    .off('click')
    .click(function () {
      fs.writeFileSync('scouting/matchNum.txt', parseInt(matchNum) + 1);
      window.location.reload();
    });
});

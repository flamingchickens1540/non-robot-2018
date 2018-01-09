window.jQuery = window.$ = require('jquery');
var scout = require('scouting');
var textareaCount = 0;
var isShift;
scout.init('blank');
scout.page('Match Notes', [6, 6]);
scout.textarea('.cell-match-notes-1', 'Red Auto', 'Type here...', 'redAuto');
scout.textarea('.cell-match-notes-1', 'Red Teleop', 'Type here...', 'redTeleop');
scout.textarea('.cell-match-notes-1', 'Red Endgame', 'Type here...', 'redEndgame');
scout.textarea('.cell-match-notes-2', 'Blue Auto', 'Type here...', 'blueAuto');
scout.textarea('.cell-match-notes-2', 'Blue Teleop', 'Type here...', 'blueTeleop');
scout.textarea('.cell-match-notes-2', 'Blue Endgame', 'Type here...', 'blueEndgame');
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

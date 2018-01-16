// Require
window.jQuery = window.$ = require('jquery');
const scout = require('scouting');

// Initialization
scout.init('pit', true);

// Home Page
scout.page('Pit Scouting', [12]);
scout.login('.cell-pit-scouting-1', 1540);

// Phone Number
scout.page('Phone Number', [12]);
scout.input('.cell-phone-number-1', 'Drive Coach/Strategy Manager\'s Phone Number', '503-123-4567', 'phone');
scout.radio('.cell-phone-number-1', '',
  [
    {text: 'Mentor', color: 'info', value: true},
    {text: 'Student', color: 'info', value: false}
  ], 'occupation', true);

// Auto
scout.page('Auto', [4, 4, 4]);
scout.checkbox('.cell-auto-1', 'L Switch',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'leftSwitchAuto', true);
scout.checkbox('.cell-auto-2', 'R Switch',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'rightSwitchAuto', true);
scout.checkbox('.cell-auto-3', 'L Scale',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'leftScaleAuto', true);
scout.checkbox('.cell-auto-1', 'R Scale',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'rightScaleAuto', true);
scout.checkbox('.cell-auto-2', '2 Cube Auto',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'twoCubeAuto', true);
scout.checkbox('.cell-auto-3', 'Exchange Station',
  [
    {text: 'Left Auto'},
    {text: 'Mid Auto'},
    {text: 'Right Auto'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'exchangeAuto', true);

// Teleop
scout.page('Tele-Op', [4, 5, 3]);
scout.radio('.cell-tele-op-1', 'Preferred Robot Role',
  [
    {text: 'Switching', color: 'info'},
    {text: 'Scaling', color: 'info'},
    {text: 'Defense', color: 'info'},
    {text: 'Exchange', color: 'info'}
  ], 'robotRole', true);
scout.textarea('.cell-tele-op-1', 'Robot Role Notes', 'Notes...', 'robotRoleNotes', false);
scout.radio('.cell-tele-op-2', 'Climb',
  [
    {text: 'Support', color: 'info', value: 'support'},
    {text: 'No Support', color: 'warning', value: 'self'},
    {text: 'Nope', color: 'danger', value: false}
  ], 'climb', true);
scout.radio('.cell-tele-op-2', 'Climb Time Estimate',
  [
    {text: '5', color: 'info'},
    {text: '10', color: 'info'},
    {text: '15', color: 'info'},
    {text: '20', color: 'info'},
    {text: '25', color: 'info'},
    {text: '30', color: 'info'}
  ], 'climbTime', false);
scout.textarea('.cell-tele-op-2', 'Climb Notes', 'Notes...', 'climbNotes', false);
scout.radio('.cell-tele-op-3', 'Cube Loading Method',
  [
    {text: 'Pneumatics', color: 'info'},
    {text: 'Roller', color: 'info'},
    {text: 'Other', color: 'info'}
  ], 'cubeLoadMethod', true);
scout.input('.cell-tele-op-3', 'Other', 'Cube Loading Method', 'cubeLoadOther', false);
scout.radio('.cell-tele-op-3', 'Cube Loading Location',
  [
    {text: 'Ground', color: 'info'},
    {text: 'Portal', color: 'info'}
  ], 'cubeLoad', true);
$(document).ready(function () {
  $('.in-16').hide();
  $('.btn-15-3').click(function () {
    $('.in-16').fadeIn(1000);
  });
  $('.btn-12-3').click(function () {
    $('.mc-13').fadeOut(1000);
  });
});

// Other info
scout.page('Other Info', [4, 4, 4]);
scout.radio('.cell-other-info-1', 'Language of Robot Code',
  [
    {text: 'Java', color: 'info'},
    {text: 'LabView', color: 'info'},
    {text: 'C++', color: 'info'},
    {text: 'Kotlin', color: 'info'},
    {text: 'Python', color: 'info'}
  ], 'lang', true);
scout.radio('.cell-other-info-2', 'Drive Train',
  [
    {text: '4 Wheel', color: 'info'},
    {text: '6 Wheel', color: 'info'},
    {text: '8 Wheel', color: 'info'},
    {text: 'Shifting', color: 'info'},
    {text: 'Swerve', color: 'info'}
  ], 'driveTrain', true);
scout.text('.cell-other-info-3', 'Cheesecakability', 24);
scout.radio('.cell-other-info-3', 'Willingness',
  [
    {text: '👍', color: 'success', value: true},
    {text: '👎', color: 'danger', value: false}
  ], 'cheeseWillingness', true);
scout.radio('.cell-other-info-3', 'Space on Robot',
  [
    {text: '👍', color: 'success', value: true},
    {text: '👎', color: 'danger', value: false}
  ], 'cheeseSpace', true);
scout.input('.cell-other-info-2', 'Weight of Robot', 'In pounds...', 'weight', true);

// Photo
scout.page('Photo and Finish', [12]);
scout.text('.cell-photo-and-finish-1', 'Remember to take a 📸 of the 🤖!', 72);
scout.done('.cell-photo-and-finish-1', true);

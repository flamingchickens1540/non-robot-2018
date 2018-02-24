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
scout.input('.cell-phone-number-1', 'Drive Coach/Strategy Manager\'s Phone Number', '503-867-5309', 'phone');
scout.radio('.cell-phone-number-1', '',
  [
    {text: 'Mentor', color: 'info', value: 'Yep'},
    {text: 'Student', color: 'info', value: 'Nope'}
  ], 'occupation', true);

// Auto
scout.page('Auto', [4, 4, 4]);
scout.radio('.cell-auto-1', 'Switch',
  [
    {text: '👍', color: 'success', value: 'Yep'},
    {text: '👎', color: 'danger', value: 'Nope'}
  ], 'switchAuto', true);
scout.radio('.cell-auto-2', 'Scale',
  [
    {text: '👍', color: 'success', value: 'Yep'},
    {text: '👎', color: 'danger', value: 'Nope'}
  ], 'scaleAuto', true);
scout.radio('.cell-auto-3', 'Exchange',
  [
    {text: '👍', color: 'success', value: 'Yep'},
    {text: '👎', color: 'danger', value: 'Nope'}
  ], 'exchangeAuto', true);
scout.radio('.cell-auto-1', 'Two Cube',
  [
    {text: '👍', color: 'success', value: 'Yep'},
    {text: '👎', color: 'danger', value: 'Nope'}
  ], 'twoCubeAuto', true);
scout.radio('.cell-auto-3', 'Cross Line',
  [
    {text: '👍', color: 'success', value: 'Yep'},
    {text: '👎', color: 'danger', value: 'Nope'}
  ], 'lineAuto', true);
// scout.checkbox('.cell-auto-1', 'Left Switch',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'leftSwitchAuto', true);
// scout.checkbox('.cell-auto-2', 'Right Switch',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'rightSwitchAuto', true);
// scout.checkbox('.cell-auto-3', 'Left Scale',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'leftScaleAuto', true);
// scout.checkbox('.cell-auto-1', 'Right Scale',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'rightScaleAuto', true);
// scout.checkbox('.cell-auto-2', '2 Cube Auto',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'twoCubeAuto', true);
// scout.checkbox('.cell-auto-3', 'Exchange Station',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'exchangeAuto', true);
// scout.checkbox('.cell-auto-2', 'Cross Line',
//   [
//     {text: 'Left Auto'},
//     {text: 'Mid Auto'},
//     {text: 'Right Auto'},
//     {text: 'Nope', color: 'danger', value: false}
//   ], 'lineAuto', true);

// Teleop
scout.page('Tele-Op', [4, 5, 3]);
scout.checkbox('.cell-tele-op-1', 'Preferred Robot Role',
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
    {text: 'Solo', color: 'warning', value: 'self'},
    {text: 'Nope', color: 'danger', value: false, class: 'no-climb'}
  ], 'climb', true);
// scout.radio('.cell-tele-op-2', 'Climb Time Estimate',
//   [
//     {text: '5', color: 'info'},
//     {text: '10', color: 'info'},
//     {text: '15', color: 'info'},
//     {text: '20', color: 'info'},
//     {text: '25', color: 'info'},
//     {text: '30', color: 'info'}
//   ], 'climbTime', false, 'climb-time');
scout.radio('.cell-other-info-3', 'Climb On Us',
  [
    {text: '👍', color: 'success', value: true},
    {text: '👎', color: 'danger', value: false}
  ], 'climbOnUs', true);
scout.textarea('.cell-tele-op-2', 'Climb Notes', 'Notes...', 'climbNotes', true);
// scout.radio('.cell-tele-op-3', 'Cube Loading Method',
//   [
//     {text: 'Pneumatics', color: 'info'},
//     {text: 'Roller', color: 'info'},
//     {text: 'Other', color: 'info', class: 'cube-other-load'}
//   ], 'cubeLoadMethod', true, 'cube-load');
scout.input('.cell-tele-op-3', 'Other', 'Cube Loading Method', 'cubeLoadMethod', false, 'other-load');
scout.checkbox('.cell-tele-op-3', 'Cube Loading Location',
  [
    {text: 'Ground'},
    {text: 'Portal'}
  ], 'cubeLoad', true);
$(document).ready(function () {
  $('.other-load').hide();
  $('.cube-other-load').click(function () {
    $('.other-load').fadeIn(1000);
  });
  // $('.no-climb').click(function () {
  //   $('.climb-time').parent().parent().fadeOut(1000);
  // });
});

// Other info
scout.page('Other Info', [6, 6]);
scout.radio('.cell-other-info-1', 'Language of Robot Code',
  [
    {text: 'Java', color: 'info'},
    {text: 'LabView', color: 'info'},
    {text: 'C++', color: 'info'},
    {text: 'Python', color: 'info'},
    {text: 'Other', color: 'info', class: 'other-lang'}
  ], 'lang', true);
scout.input('.cell-other-info-1', 'Other', 'Javascript =P', 'lang', false, 'lang-other');
scout.radio('.cell-other-info-2', 'Type of Wheel',
  [
    {text: 'Colsons', color: 'info'},
    {text: 'Omni', color: 'info'},
    {text: 'Mecanum', color: 'info'},
    {text: 'Other', color: 'info', class: 'other-wheel'}
  ], 'driveTrain', true);
scout.input('.cell-other-info-2', 'Other', 'No Wheels =P', 'driveTrain', false, 'wheel-other');
// scout.text('.cell-other-info-3', 'Cheesecakability', 24);
// scout.radio('.cell-other-info-3', 'Willingness',
//   [
//     {text: '👍', color: 'success', value: true},
//     {text: '👎', color: 'danger', value: false}
//   ], 'cheeseWillingness', true);
// scout.radio('.cell-other-info-3', 'Space on Robot',
//   [
//     {text: '👍', color: 'success', value: true},
//     {text: '👎', color: 'danger', value: false}
//   ], 'cheeseSpace', true);
scout.input('.cell-other-info-2', 'Weight of Robot (w/o Bumpers and Battery)', 'In pounds...', 'weight', true);
$(document).ready(function () {
  $('.lang-other').hide();
  $('.other-lang').click(function () {
    $('.lang-other').fadeIn(1000);
  });
  $('.wheel-other').hide();
  $('.other-wheel').click(function () {
    $('.wheel-other').fadeIn(1000);
  });
});
scout.page('Notes', [12]);
scout.textarea('.cell-notes-1', 'Notes', 'Notes...', 'notes', true);

// Photo
scout.page('Photo and Finish', [12]);
scout.text('.cell-photo-and-finish-1', 'Remember to take a 📸 of the 🤖!', 72);
scout.done('.cell-photo-and-finish-1', true);

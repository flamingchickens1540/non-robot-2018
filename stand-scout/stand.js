window.jQuery = window.$ = require('jquery');
var Popper = require('popper.js');
var bootstrap = require('bootstrap');
var scout = require('scouting');
scout.init('stand', true);

//************************************** Global vars
var notyscale;
var notybluePortal1;
var notybluePortal2;
var notyredPortal1;
var notyredPortal2;
var notyblueSwitch;
var notyredSwitch;
var notyblueExchange;
var notyredExchange;
var notybluePlatform;
var notyredPlatform;
var notygiza;
var color;
// var notyBluePortal1 = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-blueportal1"></div>'
// })
// var notyBluePortal2 = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-blueportal2"></div>'
// })
// var notyRedPortal1 = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-redportal1"></div>'
// })
// var notyRedPortal2 = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-redportal2"></div>'
// })
// var notyBlueSwitch = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-blueswitch"></div>'
// })
// var notyRedSwitch = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-redswitch"></div>'
// })
// var notyBlueExchange = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-blueexchange"></div>'
// })
// var notyRedExchange = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-redexchange"></div>'
// })
// var notyBluePlatform = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-blueplatform"></div>'
// })
// var notyRedPlatform = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-redplatform"></div>'
// })
// var notyGiza = new Noty({
//   type: 'success',
//   layout: 'center',
//   closeWith: ['button'],
//   text: '<div class="noty-giza"></div>'
// })
//************************************** Login Page
scout.page(
  'Login',[2,8,2]
)
scout.login(
  '.cell-login-2',
  1540
)
//*************************************** Auto page
scout.page(
  'Auto', [4, 2, 3, 3]
)
scout.radio(
  '.cell-auto-1',
  'Where did the robot start (From Human Player in Exchange Perspective)',
  [{
    text: 'Left side ',
    color: 'warning',
    value: 'left'
  },
  {
    text: 'Center ',
    color: 'warning',
    value: 'center'
  },
  {
    text: 'Right side ',
    color: 'warning',
    value: 'right'
  }],
  'start'
);
scout.checkbox(
  '.cell-auto-2',
  'Cross Line?',
  [
    {
      text: 'Crossed Line',
      color: 'info',
      value: 'Line'
    }
  ],
  'crossLine'
);
scout.cycle(
  '.cell-auto-3',
  'Boxes on switch',
  [
    {text: 1, color: 'success'},
    {text: 2, color: 'success'}
  ],
  'switchAuto',
  true
)
scout.cycle(
  '.cell-auto-4',
  'Boxes on Scale',
  [
    {text: 1, color: 'success'},
    {text: 2, color: 'success'}
  ],
  'scaleAuto',
  true
)
//************************************** Tele page
scout.page(
  'Teleop', [12]
)
// $(document).ready(function () {
  //************************************ Arrays for loops
  var buttons = ["scale", "bluePortal1", "bluePortal2", "redPortal1", "redPortal2", "blueSwitch", "redSwitch", "blueExchange", "redExchange", "bluePlatform", "redPlatform", "giza"]
  var names = ["Scale", "Blue Portal 1", "Blue Portal 2", "Red Portal 1", "Red Portal 2", "Blue Switch", "Red Switch", "Blue Exchange", "Red Exchange", "Blue platform", "Red platform", "Giza"]
  //************************************ Loop creating the div's and the buttons
  for (var i = 0; i < buttons.length; i++) {
    $('.cell-teleop-1').append(`
      <div class='modal fade modal-` + buttons[i] + `' role='dialog'>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" style="text-align:center;">
              <h3>` + names[i] + `</h3>
            </div>
            <div class="modal-body">
              <div class='div` + buttons[i] + `'></div>
            </div>
          </div>
        </div>
      </div>
    `)
    if (buttons[i].indexOf("blue") == 0) {
      $('.cell-teleop-1').append('<button type="button" class="btn btn-primary btn-small button-' + buttons[i] + '" data-toggle="modal" data-target=".modal-' + buttons[i] + '">' + names[i] + '</button>');
    }
    else if (buttons[i].indexOf("red") == 0) {
      $('.cell-teleop-1').append('<button type="button" class="btn btn-danger btn-small button-' + buttons[i] + '"  data-toggle="modal" data-target=".modal-' + buttons[i] + '">' + names[i] + '</button>');
    }
    else if (buttons[i].indexOf("giza") == 0) {
      if ($('.role-name').text().indexOf("Blue") == 0){
        $('.cell-teleop-1').append('<button type="button" class="btn btn-primary btn-small button-giza" style="position: absolute; left: 56.5vw; top: 38vh; right: 50vh; width: 6.2vw; font-size: .9vw; height: 3.5vh;"  data-toggle="modal" data-target=".modal-' + buttons[i] + '">Cube Zone</button>')
      }
      else{
        $('.cell-teleop-1').append('<button type="button" class="btn btn-danger btn-small button-giza" style="position: absolute; left: 17vw; top: 38vh; right: 50vh; width: 6.2vw; font-size: .9vw; height: 3.5vh;"  data-toggle="modal" data-target=".modal-' + buttons[i] + '">Cube Zone</button>')
      }
    }
    else {
      $('.cell-teleop-1').append('<button type="button" class="btn btn-success btn-small button-scale" data-toggle="modal" data-target=".modal-' + buttons[i] + '">Scale</button>')
    }
  }
  //************************************ Tele scouting functions
  scout.cycle(
    '.divscale',
    'Boxes on Scale',
    [
      {text: 1, color: 'success'},
      {text: 1, color: 'success'}
    ],
    'scale',
    false
  )
  scout.cycle(
    '.divredSwitch',
    'Boxes on Red Switch',
    [{text: 1, color: 'danger'}],
    'redSwitch',
    false
  )
  scout.cycle(
    '.divblueSwitch',
    'Boxes on Blue Switch',
    [{text: 1, color: 'info'}],
    'blueSwitch',
    false
  )
  scout.cycle(
    '.divredPlatform',
    'Boxes taken from red platform',
    [{text: 1, color: 'danger'}],
    'redPlatformCube',
    false
  )
  scout.cycle(
    '.divbluePlatform',
    'Boxes taken from blue platform',
    [{text: 1, color: 'info'}],
    'bluePlatformCube',
    false
  )
  if ($('.role-name').text().indexOf("Blue") == 0){
    scout.radio(
      '.divbluePlatform',
      'Climbing',
      [{
        text: 'Climbed Front',
        color: 'info',
        value: 'climbFront'
      },
      {
        text: 'Climbed Side',
        color: 'info',
        value: 'climbSide'
      },
      {
        text: 'Assisted Climb',
        color: 'info',
        value: 'assist'
      },
      {
        text: 'Levitate',
        color: 'info',
        value: 'levitate'
      },
      {
        text: 'Parking',
        color: 'info',
        value: 'parking'
      }],
      'start'
    );
    $('.divbluePlatform .bg-9').removeClass('btn-group')
    $('.divbluePlatform .scout-mc').after('')
    scout.checkbox(
      '.divblueExchange',
      'Blue Exchange Cubes',
      [
        {
          text: 'Recived Cube',
          color: 'info',
          value: 'load'
        },
        {
          text: 'Placed Cube',
          color: 'info',
          value: 'place'
        }
      ],
      'blueExchange'
    );
    scout.cycle(
      '.divgiza',
      'Boxes taken from the Pyramid',
      [{text: 1, color: 'info'}],
      'pyramid',
      false
    )
    scout.cycle(
      '.divbluePortal1',
      'Boxes taken from portal',
      [{text: 1, color: 'info'}],
      'bluePortal',
      false
    )
    scout.cycle(
      '.divbluePortal2',
      'Boxes taken from portal',
      [{text: 1, color: 'info'}],
      'bluePortal',
      false
    )
  }
  else{
    scout.radio(
      '.divredPlatform',
      'Climbing',
      [{
        text: 'Climbed Front',
        color: 'danger',
        value: 'climbFront'
      },
      {
        text: 'Climbed Side',
        color: 'danger',
        value: 'climbSide'
      },
      {
        text: 'Assisted Climb',
        color: 'danger',
        value: 'assist'
      },
      {
        text: 'Levitate',
        color: 'danger',
        value: 'levitate'
      },
      {
        text: 'Parking',
        color: 'danger',
        value: 'parking'
      }],
      'start'
    );
    $('.divredPlatform .bg-9').removeClass('btn-group')
    $('.divredPlatform .scout-mc').after('')
    scout.checkbox(
      '.divredExchange',
      'Red Exchange Cubes',
      [
        {
          text: 'Recived Cube',
          color: 'danger',
          value: 'load'
        },
        {
          text: 'Placed Cube',
          color: 'danger',
          value: 'place'
        }
      ],
      'redExchange'
    );
    scout.cycle(
      '.divgiza',
      'Boxes taken from the Pyramid',
      [{text: 1, color: 'danger'}],
      'pyramid',
      false
    )
    scout.cycle(
      '.divredPortal1',
      'Boxes taken from portal',
      [{text: 1, color: 'danger'}],
      'redPortal',
      false
    )
    scout.cycle(
      '.divredPortal2',
      'Boxes taken from portal',
      [{text: 1, color: 'danger'}],
      'redPortal',
      false
    )
}
for (var i = 0; i < buttons.length; i++) {
  if ($('.div' + buttons[i]).html() == '') {
      $('.div' + buttons[i]).append('<span>Sorry, This Robot is Useless Here</span>')
    }
  }
// })
//should I seperate portals?
//Defense
//Done button
//Div
  //************************************ Loop creating the notys and running the click functions for the buttons
    // var a = 'noty' + info
    // var b = new Noty({
    //   type: 'success',
    //   layout: 'center',
    //   closeWith:["button"],
    //   text: $('.div' + buttons[i])
    // })
    // eval("var noty" + info + " = b")
    // $('.button-' + info).click(function () {
    //   var z = $(this).attr('class').indexOf("button")
    //   var y = $(this).attr('class').substr(z + 7)
    //   eval("noty" + y).show()
    // })
  // $('.cell-teleop-1').append('<div class="noty-scale"></div>')
  // scout.cycle(
  //   '.noty-scale',
  //   'Boxes on Scale',
  //   [{text: 1, color: 'success'}],
  //   'scaleTele',
  //   true
  // )
  // $('.noty-scale').addClass('hidden')
  // var notyScale = new Noty({
  //   type: 'success',
  //   layout: 'center',
  //   closeWith: ['button'],
  //   text: $('.noty-scale').html()
  // })
  ////////////
  // $('.button-blue-portal1').click(function () {
  //   notyBluePortal1.show()
  // });
  // $('.button-blue-portal2').click(function () {
  //   notyBluePortal2.show()
  // });
  // $('.button-red-portal1').click(function () {
  //   notyRedPortal1.show()
  // });
  // $('.button-red-portal2').click(function () {
  //   notyRedPortal2.show()
  // });
  // $('.button-blue-switch').click(function () {
  //   notyBlueSwitch.show()
  // });
  // $('.button-red-switch').click(function () {
  //   notyRedSwitch.show()
  // });
  // $('.button-blue-exchange').click(function () {
  //   notyBlueExchange.show()
  // });
  // $('.button-red-exchange').click(function () {
  //   notyRedExchange.show()
  // });
  // $('.button-blue-platform').click(function () {
  //   notyBluePlatform.show()
  // });
  // $('.button-blue-platform').click(function () {
  //   notyRedPlatformf.show()
  // });
  // $('.button-giza').click(function () {
  //   notyGiza.show()
  // });
//************************************** Climb/endgame page
scout.page(
  'Endgame', [5,6,1]
)
scout.textarea(
  '.cell-endgame-1',
  'Climbing notes',
  "This robot's climbing system was...",
  'climbNotes'
)
scout.textarea(
  '.cell-endgame-2',
  'Overall notes',
  'This robot overall was...',
  'notes'
)
scout.done(
  '.cell-endgame-3',
  false
)
//make buttons do stuff, create endgame page

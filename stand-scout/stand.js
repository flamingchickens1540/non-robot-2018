window.jQuery = window.$ = require('jquery');
var Popper = require('popper.js');
var bootstrap = require('bootstrap');
var scout = require('scouting');
const fs = require('fs-extra');
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
var time;
var cycleTime;
var cycleArray = {
  'team': parseInt($('.role-team').text()),
  'scale':[],
  'blueswitch':[],
  'redswitch':[],
  'exchange':[]
};
var cycleManifest;
var cycleData;
var buttons = ["scale", "bluePortal1", "bluePortal2", "redPortal1", "redPortal2", "blueSwitch", "redSwitch", "blueExchange", "redExchange", "bluePlatform", "redPlatform", "giza"]
var names = ["Scale", "Blue Portal 1", "Blue Portal 2", "Red Portal 1", "Red Portal 2", "Blue Switch", "Red Switch", "Blue Exchange", "Red Exchange", "Blue platform", "Red platform", "Cube Zone"]
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
  false
)
scout.cycle(
  '.cell-auto-4',
  'Boxes on Scale',
  [
    {text: 1, color: 'success'},
    {text: 2, color: 'success'}
  ],
  'scaleAuto',
  false
)
//************************************** Tele page
scout.page(
  'Teleop', [12]
)
// $(document).ready(function () {
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
        $('.cell-teleop-1').append('<button type="button" class="btn btn-primary btn-small button-giza" style="position: absolute; left: 56.5vw; top: 38vh; right: 50vh; height: 3.5vh; width: 6.5vw; font-size: .9vw;"  data-toggle="modal" data-target=".modal-' + buttons[i] + '">Cube Zone</button>')
      }
      else{
        $('.cell-teleop-1').append('<button type="button" class="btn btn-danger btn-small button-giza" style="position: absolute; left: 16vw; top: 38vh; height: 3.5vh; width: 6.5vw; font-size: .9vw;"  data-toggle="modal" data-target=".modal-' + buttons[i] + '">Cube Zone</button>')
      }
    }
    else {
      $('.cell-teleop-1').append('<button type="button" class="btn btn-success btn-small button-scale" data-toggle="modal" data-target=".modal-' + buttons[i] + '">Scale</button>')
    }
  }
  // if ($('.role-name').text().indexOf("Blue") == 0) {
  //   $('.cell-teleop-1').append(`
  //     <img src="ArcadeBlue.png" style="width: 80vw; height: 60vh;" usemap="#arcadeblue" class="arcade img-fluid">
  //     <map name="arcadeblue">
  //       <area shape="rect" class="blue1" coords="7, 20, 127, 60" data-toggle="modal" data-target=".modal-` + buttons[1] +`">
  //       <area shape="rect" class="blue2" coords="7, 480, 127, 520" data-toggle="modal" data-target=".modal-` + buttons[2] +`">
  //       <area shape="rect" class="red1" coords="1020, 20, 1140, 60" data-toggle="modal" data-target=".modal-` + buttons[3] +`">
  //       <area shape="rect" class="red2" coords="1020, 480, 1140, 520" data-toggle="modal" data-target=".modal-` + buttons[4] +`">
  //       <area shape="rect" class="blueexchange" coords="1020, 600, 1140, 677" data-toggle="modal" data-target=".modal-` + buttons[7] +`">
  //       <area shape="rect" class="redexchange" coords="0,401,0,482" data-toggle="modal" data-target=".modal-` + buttons[8] +`">
  //       <area shape="rect" class="blueplatform" coords="0,267,0,345" data-toggle="modal" data-target=".modal-` + buttons[9] +`">
  //       <area shape="rect" class="redplatform" coords="0,267,0,345" data-toggle="modal" data-target=".modal-` + buttons[10] +`">
  //       <area shape="rect" class="blueswitch" coords="0,736,0,813" data-toggle="modal" data-target=".modal-` + buttons[5] +`">
  //       <area shape="rect" class="redswitch" coords="0,736,0,813" data-toggle="modal" data-target=".modal-` + buttons[6] +`">
  //       <area shape="rect" class="scale" coords="0, 513, 0, 589" data-toggle="modal" data-target=".modal-` + buttons[0] +` onclick="function(){console.log('hi')}"">
  //       <area shape="rect" class="gizablue" coords="0,502,0,579" data-toggle="modal" data-target=".modal-` + buttons[11] +`">
  //     </map>
  //   `)
  // }
  // else{
  //   $('.cell-teleop-1').append(`
  //     <img src="ArcadeRed.png" width="80vw" height="60vh" usemap="#arcadered" class="arcade">
  //     <map name="arcadered">
  //       <area shape="rect" class="blue1" coords="14,42,256,121" data-toggle="modal" data-target=".modal-` + buttons[1] +`">
  //       <area shape="rect" class="blue2" coords="14,960,256,1041" data-toggle="modal" data-target=".modal-` + buttons[2] +`">
  //       <area shape="rect" class="red1" coords="2050,42,2285,121" data-toggle="modal" data-target=".modal-` + buttons[3] +`">
  //       <area shape="rect" class="red2" coords="2050,960,2285,1041" data-toggle="modal" data-target=".modal-` + buttons[4] +`">
  //       <area shape="rect" class="blueexchange" coords="2004,600,2274,677" data-toggle="modal" data-target=".modal-` + buttons[7] +`">
  //       <area shape="rect" class="redexchange" coords="26,401,295,482" data-toggle="modal" data-target=".modal-` + buttons[8] +`">
  //       <area shape="rect" class="blueplatform" coords="854,267,1102,345" data-toggle="modal" data-target=".modal-` + buttons[9] +`">
  //       <area shape="rect" class="redplatform" coords="1193,267,1448,345" data-toggle="modal" data-target=".modal-` + buttons[10] +`">
  //       <area shape="rect" class="blueswitch" coords="635,736,858,813" data-toggle="modal" data-target=".modal-` + buttons[5] +`">
  //       <area shape="rect" class="redswitch" coords="1445,736,1672,813" data-toggle="modal" data-target=".modal-` + buttons[6] +`">
  //       <area shape="rect" class="scale" coords="1079, 513, 1214, 589" data-toggle="modal" data-target=".modal-` + buttons[0] +` onclick="function(){console.log('hi')}"">
  //       <area shape="rect" class="gizared" coords="461,503,679,557" data-toggle="modal" data-target=".modal-` + buttons[11] +`">
  //     </map>
  //   `)
  // }
  //************************************ Tele scouting functions
  scout.cycle(
    '.divscale',
    'Boxes on Scale',
    [
      {text: 1, color: 'success'},
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
        text: 'Front',
        color: 'info',
        value: 'climbFront'
      },
      {
        text: 'Side',
        color: 'info',
        value: 'climbSide'
      },
      {
        text: 'Assisted',
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
        text: 'Front',
        color: 'danger',
        value: 'climbFront'
      },
      {
        text: 'Side',
        color: 'danger',
        value: 'climbSide'
      },
      {
        text: 'Climb',
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
$(document).ready(function(){
  if (!fs.existsSync('cycle/' + $('.role-team').text() + '-cycle.json')) {
    fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleArray))
  }
  $('.cycle-submit-14, .cycle-submit-15, .cycle-submit-10, .cycle-submit-13, .cycle-submit-9, .btn-12-1').click(function(){
    time = new Date().getTime()
  })
  $('.btn-12-2, .cycle-submit-8, .cycle-submit-7, .cycle-submit-6').click(function () {
    if (!fs.existsSync('cycle/')) {
      fs.mkdirSync('cycle/')
    }
    var currentTime = new Date().getTime()
    cycleTime = currentTime - time
    if ($(this).hasClass('btn-12-2')) {
      var m = cycleArray['exchange'].length
      cycleArray['exchange'][m] = cycleTime
    }
    for (var i = 5; i < 10; i++) {
      if ($(this).hasClass('cycle-submit-' + i)) {
        if (i == 6) {
          var cycleJSON = JSON.parse(fs.readFileSync('cycle/' + $('.role-team').text() + '-cycle.json'));
          var n = cycleJSON['scale'].length
          cycleJSON['scale'][n] = cycleTime
          fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleJSON))
        }
        else if(i == 7) {
          var m = cycleArray['redswitch'].length
          cycleArray['redswitch'][m] = cycleTime
        }
        else if(i == 8) {
          var m = cycleArray['blueswitch'].length
          cycleArray['blueswitch'][m] = cycleTime
        }
      }
    }
    if (!fs.existsSync('cycle/manifest.json')) {
      fs.writeFileSync('cycle/manifest.json', '[]')
    }
    cycleManifest = JSON.parse(fs.readFileSync('cycle/manifest.json', 'utf8'))
    for (var i = 0; i < cycleManifest.length; i++) {
      cycleData.push(JSON.parse(fs.readFileSync('cycle/' + cycleManifest[i] + '.json', 'utf-8')));
    }
  })
})
//14, 15 are color based 10, 9, 13, exchange
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

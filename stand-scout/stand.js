window.jQuery = window.$ = require('jquery');
var noty = require('noty');
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
var quotes = JSON.parse(fs.readFileSync('quotes.json'))
var cycleManifest;
var cycleData;
var buttons = ["scale", "bluePortal1", "bluePortal2", "redPortal1", "redPortal2", "blueSwitch", "redSwitch", "blueExchange", "redExchange", "bluePlatform", "redPlatform", "giza"]
var names = ["Scale", "Blue Portal 1", "Blue Portal 2", "Red Portal 1", "Red Portal 2", "Blue Switch", "Red Switch", "Blue Exchange", "Red Exchange", "Blue platform", "Red platform", "Cube Zone"]
var successNoty = new noty({
  text: "Action Recorded!",
  layout: "topRight",
  timeout: 1000,
  progressBar: true,
  type: "success"
});
var autoNoty = new noty({
  text: "Select value for cross line",
  layout: "topRight",
  timeout: 5000,
  progressBar: true,
  type: "danger"
});
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
  'Auto', [4, 4, 4]
)
scout.radio(
  '.cell-auto-1',
  'Cross Line?',
  [
    {
      text: 'Yes',
      color: 'success',
      value: 'Line'
    },
    {
      text: 'No',
      color: 'danger',
      value: 'noline'
    }
  ],
  'crossLine'
);
scout.counter(
  '.cell-auto-2',
  'Boxes on switch',
  1,
  'switchAuto'
)
scout.counter(
  '.cell-auto-3',
  'Boxes on Scale',
  1,
  'scaleAuto'
)
//************************************** Tele page
scout.page(
  'Teleop', [12]
)
// $(document).ready(function () {
  //************************************ Loop creating the div's and the buttons
  for (var i = 0; i < buttons.length; i++) {
    $('.cell-teleop-1').append(`
      <div class='modal fade modal-` + buttons[i] + `' role='dialog'data-backdrop='static' >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" style="text-align:center;">
              <h3>` + names[i] + `</h3>
            </div>
            <div class="modal-body">
              <div class='div` + buttons[i] + `'></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary btn-small button-submit-` + i + ` button-submit"data-toggle="modal" data-target=".modal-` + buttons[i] + `"> Confirm </button>
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
  scout.counter(
    '.divscale',
    'Boxes on Scale',
    1,
    'scale'
  )
  scout.counter(
    '.divredSwitch',
    'Boxes on Red Switch',
    1,
    'redSwitch'
  )
  scout.counter(
    '.divblueSwitch',
    'Boxes on Blue Switch',
    1,
    'blueSwitch'
  )
  scout.counter(
    '.divredPlatform',
    'Boxes taken from red platform',
    1,
    'redPlatformCube'
  )
  scout.counter(
    '.divbluePlatform',
    'Boxes taken from blue platform',
    1,
    'bluePlatformCube'
  )
  scout.counter(
    '.divgiza',
    'Boxes taken from the Pyramid',
    1,
    'pyramid',
  )
  if ($('.role-name').text().indexOf("Blue") == 0){
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
    scout.counter(
      '.divbluePortal1',
      'Boxes taken from portal',
      1,
      'bluePortal'
    )
    scout.counter(
      '.divbluePortal2',
      'Boxes taken from portal',
      1,
      'bluePortal'
    )
  }
  else{
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
    scout.counter(
      '.divredPortal1',
      'Boxes taken from portal',
      1,
      'redPortal'
    )
    scout.counter(
      '.divredPortal2',
      'Boxes taken from portal',
      1,
      'redPortal'
    )
}
for (var i = 0; i < buttons.length; i++) {
  if ($('.div' + buttons[i]).html() == '') {
      $('.div' + buttons[i]).append('<span>Sorry, This Robot is Useless Here</span>')
  }
}
$(document).ready(function(){
  //rando helpful things - adding quotes
  var rando = Math.ceil(Math.random()*1640)
  var quoteText = quotes[rando]['quoteText']
  var quoteAuthor = quotes[rando]['quoteAuthor'] == '' ? 'Unknown' : quotes[rando]['quoteAuthor'];
  $('.cell-login-2').append(`<br><br><br><br><br><div class='quote' style='text-align: center;'>` +
  quoteText + `<br>~ ` + quoteAuthor +
  `</div>`)
  //displaying noty onclick
  $('.button-submit').click(function(){
    successNoty.show();
  })
  //Displaying Auto noty
  $('.btn-next').click(function(){
    if ($('.cell-auto-1').is(':visible') == true) {
      if (!($('.btn-2-1').hasClass('active')) && !($('.btn-2-2').hasClass('active'))) {
        autoNoty.show()
        alert('Please Select an Cross Line Value')
      }
    }
  })
  //working on cycle times and saving cycle times
  if (!fs.existsSync('cycle/' + $('.role-team').text() + '-cycle.json') == true) {
    fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleArray))
  }
  $('.button-submit-3, .button-submit-4, .button-submit-9, .button-submit-10, .button-submit-11, .btn-11-1').click(function(){
    time = new Date().getTime()
  })
  $('.btn-11-2, .button-submit-0, .button-submit-5, .button-submit-6').click(function () {
    if (!fs.existsSync('cycle/')) {
      fs.mkdirSync('cycle/')
    }
    var currentTime = new Date().getTime()
    cycleTime = currentTime - time
    console.log(cycleTime);
    if ($(this).hasClass('btn-11-2')) {
      var cycleJSON = JSON.parse(fs.readFileSync('cycle/' + $('.role-team').text() + '-cycle.json'));
      var n = cycleJSON['exchange'].length
      cycleJSON['exchange'][n] = cycleTime
      fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleJSON))
      time = 0
    }
    //figuring out the location of the cycle drop
    for (var i = 0; i < 7; i++) {
      if ($(this).hasClass('button-submit-' + i)) {
        if (i == 0) {
          var cycleJSON = JSON.parse(fs.readFileSync('cycle/' + $('.role-team').text() + '-cycle.json'));
          var n = cycleJSON['scale'].length
          cycleJSON['scale'][n] = cycleTime
          fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleJSON));
          time = 0
        }
        else if(i == 6) {
          var cycleJSON = JSON.parse(fs.readFileSync('cycle/' + $('.role-team').text() + '-cycle.json'));
          var n = cycleJSON['redswitch'].length
          cycleJSON['redswitch'][n] = cycleTime
          fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleJSON));
          time = 0
        }
         else if(i == 5) {
          var cycleJSON = JSON.parse(fs.readFileSync('cycle/' + $('.role-team').text() + '-cycle.json'));
          var n = cycleJSON['blueswitch'].length
          cycleJSON['blueswitch'][n] = cycleTime
          fs.writeFileSync('cycle/' + $('.role-team').text() + '-cycle.json', JSON.stringify(cycleJSON));
          time = 0
        }
      }
    }
    //saving the cycle time
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
  'Climb', [6,6]
)
scout.radio(
  '.cell-climb-1',
  'Climbing',
  [{
    text: 'Front',
    color: 'danger',
    value: 'climbFront'
  },
  {
    text: 'Side',
    color: 'info',
    value: 'climbSide'
  },
  {
    text: 'Assisted',
    color: 'success',
    value: 'assist'
  },
  {
    text: 'Levitate',
    color: 'info',
    value: 'levitate'
  },
  {
    text: 'Parking',
    color: 'danger',
    value: 'parking'
  }],
  'start'
);
scout.textarea(
  '.cell-climb-2',
  'Climbing notes',
  "This robot's climbing system was...",
  'climbNotes'
)
scout.page(
  'Endgame', [11,1]
)
scout.textarea(
  '.cell-endgame-1',
  'Overall notes',
  'This robot overall was...',
  'notes'
)
scout.done(
  '.cell-endgame-2',
  false
)
//Counter vs Cycle (Confirm with Tristan),
//make buttons do stuff, create endgame page

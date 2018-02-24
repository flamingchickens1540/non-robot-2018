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
//sched is a dictionary with match number as key, list of teams as value, r1, r2, r3, b1, b2, b3
//tags is a dictionary with team number as key, and list of tags as value
//rankings is dictionary with tag names as keys, each value is another dictionary with team numbers as values, list of cycle times as firt element, ranking as 2nd
//use table-hover class
scout.page('Match Preview', [12]);
$('.cell-match-preview-1').html(
   `<div class="input match-lookup" style="text-align: center;">
        <input class="form-control scout-i" placeholder="Match Number">
        <br>
        <br>
      </div>`
);

$(document).ready(function () {
  $('.match-lookup > input').keydown(function () {
    if (event.keyCode == 13) { //on key code enter (when enter is pressed after typing in input)

      onHidden = false //a boolean that tells what page we are on (fot the toggle)
      matchNumber = $(this).val();
      theTeams = sched[matchNumber];
      //possible headers -- "tags", "switch cubes", "climb", vault cubes (as averages per match)


      info = {} //given team will give list of tags

      possibleDisplays = ["Switcher", "Scaler", "Exchanger", "Defender"] //because tristan has a dumb system so this is helpful
      displayToTags = {} //because tristan has a dumb system so this is helpful
      displayToTags["Defender"] = "defense";
      displayToTags["Scaler"] = "scale";
      displayToTags["Switcher"] = "switch"
      displayToTags["Exchanger"] = "exchange"


      teamTags = "";
      for (var i = 0; i < 6; i += 1){ //for all the teams in the match
        currentTeam = theTeams[i]
        if (i < 3){
            teamTags += `<tr style="border:4px solid black" bgcolor = "#ffb3b3"> <th scope = "row" class="lookup-team">`+ currentTeam + `</th>`;
        }else{
          teamTags += `<tr style="border:4px solid black" bgcolor = "#b3b3ff"> <th scope = "row" class="lookup-team">`+ currentTeam + `</th>`;
        }


        currentTeamTagList = []
        for (var k = 0; k < possibleDisplays.length; k += 1){
          if (tags[currentTeam].indexOf(possibleDisplays[k]) != -1 || tags[currentTeam].indexOf(" " + possibleDisplays[k]) != -1 ){
            miniList = rankings[displayToTags[possibleDisplays[k]]][currentTeam];
            currentTeamTagList.push(miniList[0])
            if (miniList[1] <= 8){
              teamTags += ` <th scope = "row">`+ possibleDisplays[k] + `</th>`;
            }else{
              teamTags += `<td>` + possibleDisplays[k] + `</td>`
            }
          }else{
            currentTeamTagList.push(["9999"])
            teamTags += `<td>` + "--" + `</td>`
          }


        }
        teamTags += '</tr>'
        info[currentTeam] = currentTeamTagList //adds the team's info to a dict of teams
      }


      columnHeaderNamesString = "";
      for (var i = 0; i < possibleDisplays.length; i +=1){
        columnHeaderNamesString += `<th scope = "col">`+ possibleDisplays[i] + `</th>`
      }

      redRows = ""
      blueRows = ""
      redTotal = "";
      blueTotal = "";

      for (var z = 0; z < 2; z += 1){
        totalSwitch = 0;
        totalScale = 0;
        totalExchange = 0;
        totalDefense = 0;
        for (var y = 0; y < 3; y += 1){ //for each red team
          var i;
          if (z == 0){
            i = y;
          }else{
            i = y + 3;
          }

          if (z == 0){
            redRows += `<tr> <th scope = "row"  class="lookup-team">`+ theTeams[i] + `</th>`;
          }else{
            blueRows += `<tr> <th scope = "row"  class="lookup-team">`+ theTeams[i] + `</th>`;
          }
          teamData = info[theTeams[i]];

          for (var k = 0; k < teamData.length ; k+=1){ //for each possible tag
            var tagDataList = teamData[k];
            if (tagDataList[0] != "9999"){
              total = 0;
              for (var l = 0; l < tagDataList.length; l +=1){
                total += parseInt(tagDataList[l])

              }

              total = Math.round(total * 100 / tagDataList.length)/100

              total = (135/total).toFixed(2)

              if (z == 0){
                redRows += `<td>` + total + `</td>`;
              }else{
                blueRows += `<td>` + total + `</td>`;
              }

              if (possibleDisplays[k] == "Switcher"){
                totalSwitch += parseInt(total);
              }else if (possibleDisplays[k] == "Scaler"){
                totalScale += parseInt(total);
              }else if (possibleDisplays[k] == "Exchanger"){
                totalExchange += parseInt(total);
              }else if (possibleDisplays[k] == "Defender"){
                totalDefense += parseInt(total);
              }


            }else{
              if (z == 0){
                redRows += `<td> -- </td>`;
              }else{
                blueRows += `<td> -- </td>`;
              }

            }
          }
          if (z == 0){
            redRows +="</tr>";
          }else{
            blueRows += "</tr>";
          }
        }

        if (z == 0){
          redRows +=`<tr style="border:4px solid black" bgcolor = "#ffb3b3"> <th scope = "row" > TOTALS </th>` + `<td>` + totalSwitch + `</td><td>` + totalScale + `</td><td>` + totalExchange + `</td><td>` + totalDefense + `</td> </tr>`;
          redTotal += `<tr style="border:4px solid black" bgcolor = "#ffb3b3"> <th scope = "row" > RED </th>` + `<td>` + totalSwitch + `</td><td>` + totalScale + `</td><td>` + totalExchange + `</td><td>` + totalDefense + `</td> </tr>`
        }else{
          blueRows += `<tr style="border:4px solid black" bgcolor = "#b3b3ff"> <th scope = "row" > TOTALS </th>` + `<td>` + totalSwitch + `</td><td>` + totalScale + `</td><td>` + totalExchange + `</td><td>` +  totalDefense + `</td> </tr>`;
          blueTotal += `<tr  bgcolor = "#b3b3ff"> <th scope = "row" > BLUE </th>` + `<td>` + totalSwitch + `</td><td>` + totalScale + `</td><td>` + totalExchange + `</td><td>` +  totalDefense + `</td> </tr>`;
        }

      }


      $('.cell-match-preview-1').append(`
        <div class = "hidden">
          <p style="font-size: 25px"> Red Alliance:</p>
          <table class="table table-hover " style="border:10px solid Red">
            <thead>
              <tr class="mp-teams">
                <th scope = "col"> Teams </th>
                `
                + columnHeaderNamesString +
                `
              </tr>
            </thead>
            <tbody class="team-attr">
              `
              +redRows+
              `

            </tbody>
          </table>
          <p style="font-size: 25px"> Blue Alliance:</p>
          <table class="table table-hover " style="border:10px solid Blue">
            <thead>
              <tr class="mp-teams">
                <th scope = "col"> Teams </th>
                `
                + columnHeaderNamesString +
                `
              </tr>
            </thead>
            <tbody class="team-attr">
              `
              + blueRows+
              `

            </tbody>
          </table>
        </div>
        <div class = toShow>
          <p style="font-size: 25px"> Alliance Averages:</p>
          <table class="table table-hover " style="border:10px solid black">
            <thead>
              <tr class="mp-teams">
                <th scope = "col"> Alliances </th>
                `
                + columnHeaderNamesString +
                `
              </tr>
            </thead>
            <tbody >
              `
              + redTotal + blueTotal +
              `

            </tbody>
          </table>
          <p style="font-size: 25px"> Team Roles:</p>
          <table class="table table-hover " style="border:10px solid black">

            <tbody >
              `
              + teamTags +
              `

            </tbody>
          </table>
        </div>



        <button class = "btn btn-warning" id = "toggle" style = "font-size: 24px; float: right;"> === </button>
      `);


      for (var i in sched[$(this).val()]) {
        if (sched[$(this).val()].hasOwnProperty(i)) {
          console.log(i);
        }
      };
      $(".hidden").hide()
      $("#toggle").click(function(){
        console.log("clicked toggle")
        if (onHidden){
          onHidden = false;
          $(".toShow").hide()
          $(".hidden").show()
        }else{
          onHidden = true;
          $(".hidden").hide()
          $(".toShow").show()
        }
      });

    }
    $('.lookup-team').click(function () {
      var team = $(this);
      $('.page-pane').fadeOut(250, function () {
        $('.body-div-team-lookup').fadeIn(250);
        $('.input-team-lookup > input').val($(team).text());
        lookupTeam($('.input-team-lookup'));
      });
    });
  });
});

$(document).ready(function () {
  $('.btn-back').replaceWith('<button class="btn btn-outline-danger btn-coach-app-back" data-page="body-div-team-lookup" style="margin-left: 5%;"><i class="fa fa-chevron-left"></i> Back</button>');
  $('.btn-coach-app-back').click(function () {
    $('.page-pane').fadeOut(250, function () {
      $('.body-div-home').fadeIn(500);
      $('.active').removeClass('active');
    });
  });
});

//random code ik ill need later
//making two tables, one for each alliance (use table-dark for second one for contrast)
//load all appropriate data into tables
//make clicking on the hoverable rows direct to page @tristan


// Team Lookup
scout.page('Team Lookup', [12]);
scout.input('.cell-team-lookup-1', '', '1540', 'asdf', false , 'input-team-lookup');
$('.input-team-lookup').keydown(function () {
  if (event.keyCode == 13) {
    lookupTeam($(this));
  }
});

function lookupTeam(team) {
    $('.team-info').remove();
    $('.cell-team-lookup-1').after(`
      <div class="team-info" style="width: 100%;">
        <h1 style="text-align: center;">` + $(team).children('input').val() + `</h1>
        <br>
        <div class="row">
          <div class="col-sm-3 info-1">
            ` + card('Tag(s)', tags[$(team).children('input').val()]) + `
          </div>
          <div class="col-sm-3 info-2"></div>
          <div class="col-sm-3 info-3"></div>
          <div class="col-sm-3 info-4"></div>
          <div class="col-sm-3 info-5"></div>
        </div>
      </div>
    `);
    if (rankings['switch'][$(team).children('input').val()] != undefined) {
      $('.info-2').append(card('Switch Cycle Times', rankings['switch'][$(team).children('input').val()][0] + ' (Avg: ' + rankings['switch'][$(team).children('input').val()][2] + ')'));
    } else {
      $('.info-2').append(card('Switch Cycle Times', 'Not a switch bot'));
    }
    if (rankings['scale'][$(team).children('input').val()] != undefined) {
      $('.info-3').append(card('Scale Cycle Times', rankings['scale'][$(team).children('input').val()][0] + ' (Avg: ' + rankings['scale'][$(team).children('input').val()][2] + ')'));
    } else {
      $('.info-3').append(card('Scale Cycle Times', 'Not a scale bot'));
    }
    if (rankings['exchange'][$(team).children('input').val()] != undefined) {
      $('.info-4').append(card('Exchange Cycle Times', rankings['exchange'][$(team).children('input').val()][0] + ' (Avg: ' + rankings['exchange'][$(team).children('input').val()][2] + ')'));
    } else {
      $('.info-4').append(card('Exchange Cycle Times', 'Not an exchange bot'));
    }
    if (rankings['defense'][$(team).children('input').val()] != undefined) {
      $('.info-1').append(card('Defense Cycle Times', rankings['defense'][$(team).children('input').val()][0] + ' (Avg: ' + rankings['defense'][$(team).children('input').val()][2] + ')'));
    } else {
      $('.info-1').append(card('Defense Cycle Times', 'Not a defense bot'));
    }
    for (var i = 0; i < tags[$(team).children('input').val()].length; i++) {
      switch (tags[$(team).children('input').val()][i]) {
        case 'Switcher':
        case ' Switcher':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Switch Ranking', 'Switch: ' + rankings['switch'][$(team).children('input').val()][1]));
          break;
        case 'Scaler':
        case ' Scaler':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Scale Ranking', 'Scale: ' + rankings['scale'][$(team).children('input').val()][1]));
          break;
        case 'Exchanger':
        case ' Exchange':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Exchange Ranking', 'Exchange: ' + rankings['exchange'][$(team).children('input').val()][1]));
          break;
        case 'Defender':
        case ' Defender':
          $('.info-' + (i == 3 ? 1 : i + 2)).append(card('Defense Ranking', 'Defense: ' + rankings['defense'][$(team).children('input').val()][1]));
          break;
      };
    }
  //picture stuff
  currentRobot = $(team).children('input').val();
  console.log("current robot is " + currentRobot)
  var myString = 'robotPictures/' + currentRobot + '.jpeg';

  if (fs.existsSync(myString)){
    $(".info-5").append(`<img class = "teamPicture"   src="`+ myString + `" alt="list image" width="210" height="280">  </img>`);
  }
};

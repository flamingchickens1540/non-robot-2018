var scout = require("scouting")
var fs = require("fs-extra")
scout.init('match',true)
scout.page("Login", [12])
scout.login(".login","1540",true,"scout")
scout.page("Prematch", [4,4,4])
var schedule;
var match;
if (fs.existsSync('scouting/schedule.json')) {
  schedule = JSON.parse(fs.readFileSync('scouting/schedule.json'));
}
if (fs.existsSync('scouting/match.txt')) {
  match = fs.readFileSync('scouting/match.txt');
}
for (x=0;x<6;x++) {
  clr = "primary"
  char = "B"
  if (x<3) {
    char = "R"
    clr = "danger"
  }
  scout.radio(".cell-prematch-"+((x%3)+1),schedule[match][x],[{text:char+"1",color:clr},{text:char+"2",color:clr},{text:char+"3",color:clr}],'team-pos-'+x,true,undefined,false);
}
scout.page("Auto", [6,6]);
scout.radio('.cell-auto-1','Close Switch', [{text:"Red",color:"danger"},{text:"Blue",color:"primary"}],'switch',true,undefined,false);
scout.radio('.cell-auto-2','Close Scale', [{text:"Red",color:"danger"},{text:"Blue",color:"primary"}],'scale',true,undefined,false);
scout.page("Tele", [3,3,3,3]);
scout.text(".cell-tele-1","Team:",25,undefined)
scout.text(".cell-tele-2","Red Switch:",25,undefined)
scout.text(".cell-tele-3","Scale:",25,undefined)
scout.text(".cell-tele-4","Blue Switch:",25,undefined)
for (x=0;x<6;x++) {
  color = "red";
  if (x>2) {
    color = "blue"
  }
  scout.text(".cell-tele-1",schedule[match][x],25,undefined,color)
  $(".cell-tele-1").append("<br style='height:40px'>");
  scout.counter(".cell-tele-2","Red Switch","1","redswitch-"+x,false,undefined,true);
  scout.counter(".cell-tele-3","Scale","1","scale-"+x,false,undefined,true);
  scout.counter(".cell-tele-4","Blue Switch","1","blueswitch-"+x,false,undefined,true);
}
scout.page("Notes", [12]);
scout.textarea(".notes","Notes (optional):","","notes");
scout.done('.notes',false);
scout.flashdrive();

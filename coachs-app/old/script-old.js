var scout = require('scouting');
scout.init();


var pages = {}; //creates a dictionary of pages
var teamButtons = {}; //creates dictionary of teamButtons, with team number (as string) as key and team button as value


//ALL BUTTONS MUST HAVE THE VALUE OF THE ID OF THE PAGE THEY LEAD TO AND THE CLASS CHANGE OR THE CLASS NOTY (could add later)

class nPage{
  constructor(ID, type){
    this.ID = ID;
    ArrayList elementList = new ArrayList();
    pages[ID] = this; //adds this page to the list of pages
    if (type != "home"){ //if not the home page, add home page button and back i guess if that works
      elementList.add(HOMEBUTTON); //need to figure out this "home button" buisness
      elementList.add(BACKBUTTON); //back button's value will be the previous page? if possible?
    }
    if (type == "team"){
      //ADD EVERYTHING A TEAM PAGE NEEDS HERE
      elementList.add(NOTES);
      elementList.add(STATS);
    }else if(type == "home"){
      //ADD EVERYTHING HOME PAGE NEEDS HERE
      elementList.add(MATCHBUTTON);
      elementList.add(TEAM LOOK UP BUTTON);
      elementList.add(ROUTE SCOUT BUTTON);
    }else if (type == "matchTeams"){
      //add all the links to teams (team buttons) -- look at them from file?
      for (int i = 0; i < 6; i += 1){
        //creates new team button with appropriate color and id
        var color = "btn-success";
        if (i > 2){
          color = "btn-info";
        }
        var teamButton = new button (class ID color)
        elementList.add(teamButton); //gets the teams from the file, gets the button from the dict;
      }

    }else if (type == "matchQuickStats"){
        elementList.add(SOMETHING);
    }else if (type == "plan"){
      elementList.add(text plan);
      elementList.add(picturePlan)
    }
  }
  showEverything(){
    $(.(this.ID))show(); //shows everything with the class of the id of the page -- so all things on this page should have this id as their class
  }
  //add other functions too! (like update)
}

$(function hideEverything()){//HIDES EVERYTHING

}

$(function changePage(var pageID)){ //changes page to the page with the given id //TEAM NUMBERS ARE PAGE IDS
  //hide everything but page with page id
  hideEverything();
  $(pages[pageID]).showEverything(); //shows everything on the page witht his id -- gets page with page id from dict, calls show everything function
}

//CREATE ALL GLOBAL THINGS HERE????
//create all team buttons
//create pages for all Teams, based off File


for (int i = 0; i < file.getNumberLines(); i += 1){
  nPage(file.get(i), )
}


nPage("home", []) //create home page
//create other pages

//to do useful things on button presses
$(".btn").click(function(){ //if btn is pressed
  if ($(this).hasClass(“change”)){ //if btn is part of class "change"
    //change the page based on button value
    changePage($(this).val()); //thistakes value of button and calls change page whch uses value as id of the page wanted
  }else if ($(this).hasClass(“noty”)){
    //popup noty
    var noty = new Noty({text: 'Input text: <input class="form-control userInput" type="text">', type: 'success', closeWith: ['button'],layout: 'center'}).show();
    var userEntered;
      $('.userInput').keyup(function () {
        userEntered = $(this).text();
        if (event.which == 13) {
            noty.close();
        }
      }
    });
    //then change IF THING IS ENTERED IN NOTY -- idk how to tell thistakes
    changePage(userEntered); //changes page to the page with the id of the entered thing, hopefull a valid team number
  }else{
    print "ya fucked up";
  }
})



});

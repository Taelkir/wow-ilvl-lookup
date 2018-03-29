const refreshButton = document.querySelector(".refresh-button"); // Create a const for the button
const characterList = document.querySelector(".character-list"); // Create a const for the target <ul>
var infoDiv = document.querySelector(".info-div"); // For hiding later
let jsonObjectGuild = {}; // Store the guild-level JSON request here
var jsonObjectCharacters = []; // Store the character-level JSON requests here
var toPrint = ""; // Build up the <li> elements here filled with juicy information
var characterName = {}; // Array to store character names in for requesting their ilvl later
var xhReqGuild;
var xhReqChar;

// Call the guild API (used once)
function guildApiCall (){
  $.getJSON("https://eu.api.battle.net/wow/guild/argent-dawn/Cutthroat%20Comrades?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(data){
    jsonObjectGuild = data;
    for (i = 0; i < jsonObjectGuild.members.length; i++) {
      if (jsonObjectGuild.members[i].character.level == "110") { // Only do things if a character is level 110
        characterName[i] = jsonObjectGuild.members[i].character.name;
        // Now to look up each character as we reach them in the loop
        $.getJSON("https://eu.api.battle.net/wow/character/argent-dawn/" + characterName[i] + "?fields=items&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(json){
            jsonObjectCharacters.push(json);
            // We are now building up jsonObjectCharacters with all the characters' data
        })
      }
    } // Finished with FOR loop code
  })
};

function sortAndPrint() {
  console.log("Finished, for better or worse! Now trying to print character names and their iLvls.")
  // Code to organise the character array to go here
  jsonObjectCharacters = _.sortBy(jsonObjectCharacters, function(o) {
    return o.items.averageItemLevel;
  });
  jsonObjectCharacters = jsonObjectCharacters.reverse() // Highest at the top
  // Now to build the HTML table
  toPrint = "<table class='character-table'><tr><th>Character Name</th><th>Item Level</th></tr>"
  for (j = 0; j < jsonObjectCharacters.length; j++) {
    toPrint += "<tr><td>"
    toPrint += jsonObjectCharacters[j].name
    toPrint += "</td><td>"
    toPrint += jsonObjectCharacters[j].items.averageItemLevel
    toPrint += "</td></tr>"
  }
  toPrint += "</table>"
  infoDiv.style.display = "none";
  characterList.innerHTML = toPrint;
  $(".loading-Spinner").slideUp();
}

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  $(".loading-Spinner").slideDown();
  console.log("Thanks for clicking that button! Now to get to work.");
  guildApiCall();
  setTimeout(sortAndPrint, 4000);
  $(".refresh-button").hide();
}); // Finished with button click code

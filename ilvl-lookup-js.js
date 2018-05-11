const refreshButton = document.querySelector(".refresh-button"); // Create a const for the button
const characterList = document.querySelector(".character-list"); // Create a const for the target <ul>
const factionLogo = document.querySelector(".faction-logo");
// const guildSelect = document.querySelector("#guildNameInput")
// const serverNameInput = document.querySelector("#serverNameInput"); for later
const infoDiv = document.querySelector(".info-div"); // For hiding later
let jsonObjectCharacters = []; // Store the character-level JSON requests here
let toPrint = ""; // Build up the <li> elements here filled with juicy information
let characterName = {}; // Array to store character names in for requesting their ilvl later
let jsonObjectGuild = {}; // Store the guild-level JSON request here
let guildNameInput = "";

// Call the guild API (used once)
function guildApiCall (){
  $.getJSON("https://eu.api.battle.net/wow/guild/argent-dawn/" + guildNameInput + "?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(data){
    jsonObjectGuild = data;
    for (i = 0; i < jsonObjectGuild.members.length; i++) {
      if (jsonObjectGuild.members[i].character.level == "110") { // Only do things if a character is level 110
        characterName[i] = jsonObjectGuild.members[i].character.name;
        // Now to look up each character as we reach them in the loop
        $.getJSON("https://eu.api.battle.net/wow/character/argent-dawn/" + characterName[i] + "?fields=items&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(json){
            jsonObjectCharacters.push(json);
            // We are now building up jsonObjectCharacters with all the characters' data. Let's start printing!
            sortAndPrint();
        })
      }
    } // Finished with FOR loop code
  })
};

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  guildNameInput = encodeURI(document.querySelector("#guildNameInput").value)
  $(".loading-Spinner").slideDown();
  console.log("Thanks for clicking that button! Now to get to work.");
  guildApiCall();
  $(".refresh-button").hide();
}); // Finished with button click code

// Does what it says on the tin once we have all the data we need from the first function
function sortAndPrint() {
  console.log("Going to start trying to print character names and their iLvls.")
  // Code to organise the character array
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

// Function to show the correct logo for the guild
function factionLogoChange() {
    $(".factionLogo").innerHTML = " ";
  if ($("#guildNameInput").val() === "Tea Appreciation Society") {
    $(".faction-logo").html(`<img class="alliance-logo" id="alliance-logo" src="alliance logo.png" alt="alliance logo">`);
  } else if ($("#guildNameInput").val() === "Cutthroat Comrades") {
    $(".faction-logo").html(`<img class="horde-logo" id="horde-logo" src="horde logo.png" alt="horde logo">`);
  }
}

// Do these two on load
factionLogoChange();
$( "#guildNameInput" ).on("change", factionLogoChange);

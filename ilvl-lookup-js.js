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
let numberOfLevel120s = 0; // These two decide when to put the loading spinner away
let numberOfProcessed120s = 0;


// Call the guild API (used once)
function guildApiCall (){
  $.getJSON("https://eu.api.battle.net/wow/guild/argent-dawn/" + guildNameInput + "?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(data){
    jsonObjectGuild = data;
    // Count how many characters are 120
    for (i = 0; i < jsonObjectGuild.members.length; i++) {
      if (jsonObjectGuild.members[i].character.level == "120") {
        numberOfLevel120s += 1;
        console.log(`Looks like we've got ${numberOfLevel120s} 120s in the guild.`);
      }
    }
    if (numberOfLevel120s === 0) {
      sortAndPrint();
      $(".character-list").html("<p>No characters are max level in this guild.</p>");
    }
    for (i = 0; i < jsonObjectGuild.members.length; i++) {
      if (jsonObjectGuild.members[i].character.level == "120") { // Only do things if a character is level 120
        characterName[i] = jsonObjectGuild.members[i].character.name;
        // Now to look up each character as we reach them in the loop
        $.getJSON("https://eu.api.battle.net/wow/character/argent-dawn/" + characterName[i] + "?fields=items&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", function(json){
            jsonObjectCharacters.push(json);
            numberOfProcessed120s += 1;
            // We are now building up jsonObjectCharacters with all the characters' data. Let's start printing!
            sortAndPrint();
        }) // Finished getJSON callback for one character
      }
    } // Finished with FOR loop code
  }) // End guild-level getJSON callback
};

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  guildNameInput = encodeURI(document.querySelector("#guildNameInput").value)
  $(".loading-Spinner").css('display', 'flex');
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
  // Hide the loading spinner again once finished populating table
  if (numberOfLevel120s === numberOfProcessed120s) {
    $(".loading-Spinner").css('display', 'none');
  }
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

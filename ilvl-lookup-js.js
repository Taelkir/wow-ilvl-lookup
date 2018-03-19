const refreshButton = document.querySelector(".refresh-button"); // Create a const for the button
const characterList = document.querySelector(".character-list"); // Create a const for the target <ul>
var infoDiv = document.querySelector(".info-div"); // For hiding later
var loadingDiv = document.querySelector(".loading-spinner"); // For showing while loading
var jsonObjectGuild = {}; // Store the guild-level JSON request here
var jsonObjectCharacter = {}; // Store the character-level JSON request here
var toPrint = ""; // Build up the <li> elements here filled with juicy information
var characterName = {}; // Array to store character names in for requesting their ilvl later

// Call the guild API (used once)
function guildApiCall (){
  var xhReqGuild = new XMLHttpRequest();
  xhReqGuild.open("GET", "https://eu.api.battle.net/wow/guild/argent-dawn/Cutthroat%20Comrades?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", true);
  xhReqGuild.onload = function (e) {
    if (xhReqGuild.readyState === 4) {
      if (xhReqGuild.status === 200) {
        jsonObjectGuild = JSON.parse(xhReqGuild.responseText); // Contain the JSON in the variable
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhReqGuild.onerror = function (e) {
    console.error(xhReqGuild.statusText);
  };
  xhReqGuild.send(null);
}

// Call the character API (used many times)
function characterApiCall (){
  for (i = 0; i < jsonObjectGuild.members.length; i++) {
    if (jsonObjectGuild.members[i].character.level == "110") { // Only do things if a character is level 110
      characterName[i] = jsonObjectGuild.members[i].character.name;
      // Now to look up each character as we reach them in the loop
      var xhReqChar = new XMLHttpRequest();
      xhReqChar.open("GET", "https://eu.api.battle.net/wow/character/argent-dawn/" + characterName[i] + "?fields=items&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", false);
      xhReqChar.send(null);
      jsonObjectCharacter = JSON.parse(xhReqChar.responseText);
      // We should now have jsonObjectCharacter detailing the current character's items and armour
      toPrint += "<li><em>Name</em>: " + jsonObjectGuild.members[i].character.name + ", <em>Character Item Level</em>: " + jsonObjectCharacter.items.averageItemLevel + "</li><br>" ;
    }
  } // Finished with FOR loop code
}

function finishOff() {
  console.log("Finished, for better or worse! Now trying to print character names and their iLvls.")
  infoDiv.style.display = "none";
  characterList.innerHTML = toPrint;
  loadingDiv.style.display = "none";
}

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  loadingDiv.style.display="block";
  console.log("Thanks for clicking that button! Now to get to work.");
  guildApiCall();
  setTimeout(characterApiCall, 5000);
  setTimeout(finishOff, 10000);
}) // Finished with button click code

const refreshButton = document.querySelector(".refresh-button"); // Create a const for the button
const characterList = document.querySelector(".character-list"); // Create a const for the target <ul>
var x = document.querySelector(".info-div"); // For hiding later
var loadingDiv = document.querySelector(".loading-spinner"); // For showing while loading

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  console.log("Thanks for clicking that button! Now to get to work.");
  loadingDiv.style.display = "block";
  // This bit stolen from https://stackoverflow.com/a/11116930 because I don't understand jQuery
  var xhReqGuild = new XMLHttpRequest();
  xhReqGuild.open("GET", "https://eu.api.battle.net/wow/guild/argent-dawn/Cutthroat%20Comrades?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", false);
  xhReqGuild.send(null);
  var jsonObjectGuild = JSON.parse(xhReqGuild.responseText);
  // Stolen code finished with. For now...
  // Now have the JSON object stored in a variable called jsonObject
  var toPrint = "";
  var characterName = {}; // Array to store character names in for requesting their ilvl later
  for (i = 0; i < jsonObjectGuild.members.length; i++) {
    if (jsonObjectGuild.members[i].character.level == "110") { // Only do things if a character is level 110
      characterName[i] = jsonObjectGuild.members[i].character.name;
      // Now to look up each character as we reach them in the loop
      var xhReqChar = new XMLHttpRequest();
      xhReqChar.open("GET", "https://eu.api.battle.net/wow/character/argent-dawn/" + characterName[i] + "?fields=items&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", false);
      xhReqChar.send(null);
      var jsonObjectCharacter = JSON.parse(xhReqChar.responseText);
      // We should now have jsonObjectCharacter detailing the current character's items and armour
      toPrint += "<li><em>Name</em>: " + jsonObjectGuild.members[i].character.name + ", <em>Character Item Level</em>: " + jsonObjectCharacter.items.averageItemLevel + "</li><br>" ;
    }
  } // Finished with FOR loop code
  console.log("Finished! Now printing character names and their iLvls.")
  x.style.display = "none";
  characterList.innerHTML = toPrint;
  loadingDiv.style.display = "none";
}) // Finished with button click code

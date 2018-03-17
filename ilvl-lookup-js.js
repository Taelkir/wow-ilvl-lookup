// Create a const for the button
const refreshButton = document.querySelector(".refresh-button");
// Create a const for the target UL
const characterList = document.querySelector(".character-list");

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  console.log("Thanks for clicking that button! Now to get to work.");
  // This bit stolen from https://stackoverflow.com/a/11116930 because I don't understand jQuery
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", "https://eu.api.battle.net/wow/guild/argent-dawn/Cutthroat%20Comrades?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j", false);
  xhReq.send(null);
  var jsonObject = JSON.parse(xhReq.responseText);
  // Code copy&paste finished.
  // Now have the JSON object stored in a variable called jsonObject
  var toPrint;
  for (i = 0; i < jsonObject.members.length; i++) {
    if (jsonObject.members[i].character.level == "110") { // Only add a character to the list for printing if they're level 110
    toPrint += "<li><em>Name</em>: " + jsonObject.members[i].character.name + ", <em>Character Level</em>:" + jsonObject.members[i].character.level + "</li><br>" ;
    }
    characterList.innerHTML = toPrint;
  } // Finished with FOR loop code
}) // Finished with button click code

// Create a const for the button
const refreshButton = document.querySelector(".refresh-button");

// Function shamlessly used from https://stackoverflow.com/a/18278346 because I don't understand jQuery
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

// Listen for the button to be pressed and call and return the data we need using the above function
refreshButton.addEventListener("click", () => {
  console.log("Thanks for clicking that button! Now to get to work.");
  loadJSON('https://eu.api.battle.net/wow/guild/argent-dawn/Cutthroat%20Comrades?fields=members&locale=en_GB&apikey=wr4u5hb5magzc44cc8usfum542fq7p3j',
           function(data) { console.log(data); },
           function(xhr) { console.error(xhr); }
  );
})

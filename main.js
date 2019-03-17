
//------------------Congress 113 Senate/House Pages-------------------------//
var membersPath = congressData.results[0].members;
var partyFilter = document.getElementById("partyFilter");
var stateFilter = document.getElementById("stateFilter");

partyFilter.addEventListener("change", function() {
  createTags("party", "none");
  createTable(filter());
})

stateFilter.addEventListener("change", function() {
  createTags("state", "none");
  createTable(filter());
})

populateStateOptions();

//ensure all options are selected when loading page
// partyFilter.selectedIndex = "0";
// createTags("party", "none");
// console.log("party tags created");
//
// stateFilter.selectedIndex = "0";
// createTags("state", "none");
// console.log("state tags created");

createTable(membersPath);

// This function creates tags based on which options are selected. Its first argument
// takes the type of tag that should be created. Its second argument takes
// an exception, which is generated when a tag is exed-out. If you are just adding
// tags and not removing, the argument should be "none".
function createTags(type, exception) {
  if (type == "state") {
    tagDiv = document.getElementById("state-tag-container");
    var existingTags = Array.from(document.getElementsByClassName("state-name")).map(elt => elt.innerHTML);
    var selectedOptions = Array.from(document.querySelectorAll('#stateFilter option:checked')).map(opt => opt.value);
  }
  if (type == "party") {
    tagDiv = document.getElementById("party-tag-container");
    var existingTags = Array.from(document.getElementsByClassName("party-name")).map(elt => elt.innerHTML);
    var selectedOptions = Array.from(document.querySelectorAll('#partyFilter option:checked')).map(opt => opt.value);
  }
  // in the case that a tag has been ex'd out:
  if (exception != "none") {
    tagDiv.innerHTML = "";
    selectedOptions = existingTags;
    var exceptionIndex = selectedOptions.indexOf(exception);
    selectedOptions.splice(exceptionIndex, 1);
  }
  if (selectedOptions.includes("All")) {
    tagDiv.innerHTML = "";
    if (type == "state") {
      selectedOptions = Array.from(document.querySelectorAll('#stateFilter option')).map(opt => opt.value);
    }
    if (type == "party") {
      selectedOptions = Array.from(document.querySelectorAll('#partyFilter option')).map(opt => opt.value);
    }
    //get rid of "all" in the array
    selectedOptions.splice(0, 1);
  }
  for (var i = 0; i < selectedOptions.length; i++) {
    if ((exception == "none" && !existingTags.includes(selectedOptions[i])) ||
      exception != "none") {
      var optionTag = document.createElement("div");
      var tagName = document.createElement("div");
      if (type == "state") {
        optionTag.className = "state-tag";
        tagName.className = "state-name";
      }
      if (type == "party") {
        optionTag.className = "party-tag";
        tagName.className = "party-name";
      }
      var tagX = document.createElement("button");
      tagX.className = "tag-x";
      tagX.addEventListener("click", function() {
        removeTag();
      });
      tagName.innerHTML = selectedOptions[i];
      tagX.innerHTML = "x";
      optionTag.appendChild(tagName);
      optionTag.appendChild(tagX);
      tagDiv.appendChild(optionTag);
    }
  }
}

function removeTag() {
  var optionTag = event.target.parentElement;
  if(optionTag.className == "party-tag") {
    type = "party";
  }
  if(optionTag.className == "state-tag") {
    type = "state";
  }
  var removedTagName = optionTag.childNodes[0].innerText;
  createTags(type, removedTagName);
  createTable(filter());
}

function filter() {
  filteredMembersArray = [];
  //get all selected party values from existing state tags
  var partyFilters = Array.from(document.getElementsByClassName("party-name")).map(elt => elt.innerHTML);
  for(var i = 0; i < partyFilters.length; i++) {
    if(partyFilters[i] == "Democratic") {partyFilters[i] = "D"}
    if(partyFilters[i] == "Republican") {partyFilters[i] = "R"}
    if(partyFilters[i] == "Independent") {partyFilters[i] = "I"}
  }
  if(partyFilters.length == 0) {
    partyFilters = ["D","R","I"];
  }
  //get all selected state values from existing state tags
  var stateFilters = Array.from(document.getElementsByClassName("state-name")).map(elt => elt.innerHTML);
  if(stateFilters.length == 0) {
    stateFilters = Array.from(document.querySelectorAll('#stateFilter option')).map(opt => opt.value)
  }
  console.log("stateFilters: ", stateFilters, "partyFilters: ", partyFilters);
  for (var i = 0; i < membersPath.length; i++) {
      if ( partyFilters.includes(membersPath[i].party) && stateFilters.includes(membersPath[i].state) ) {
        filteredMembersArray.push(membersPath[i]);
      }
    }
  console.log(filteredMembersArray);
  return filteredMembersArray;
}

// accepts array of members objects (e.g. membersPath or filtered version)
function createTable(data) {
  var table = document.getElementById('rep-table');
  var tbody = document.getElementById("rep-table-body");
  tbody.innerHTML = "";
  if (data.length == 0) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<br> No matches found."
    tbody.appendChild(tr);
    tr.style.color="red";
  } else {
    for (var i = 0; i < data.length; i++) {
      var tr = document.createElement("tr");
      var a = document.createElement('a');
      var linkText = document.createTextNode(data[i].first_name + " " + data[i].last_name);
      a.appendChild(linkText);
      a.href = data[i].url;
      tr.insertCell().appendChild(a);
      tr.insertCell().innerHTML = data[i].party;
      tr.insertCell().innerHTML = data[i].state;
      tr.insertCell().innerHTML = data[i].seniority;
      tr.insertCell().innerHTML = data[i].votes_with_party_pct + "%";
      tbody.appendChild(tr);
    }
  }
  table.appendChild(tbody);
}

//get all unique states from unfiltered members data
function populateStateOptions(states) {
  var states = [];
  for (var i = 0; i < membersPath.length; i++) {
    if (!states.includes(membersPath[i].state)) {
      states.push(membersPath[i].state);
    }
  }
  states = states.sort();
  states.unshift("All");
  var select = document.getElementById("stateFilter");
  for (var i = 0; i < states.length; i++) {
    var option = document.createElement('option');
    option.value = states[i];
    option.innerHTML = states[i];
    select.appendChild(option);
  }
}


//------------------Congress 113 Senate/House Pages-------------------------//
var membersPath = congressData.results[0].members;

//party checkboxes
var democratFilter = document.getElementById("democratFilter");
var republicanFilter = document.getElementById("republicanFilter");
var independentFilter = document.getElementById("independentFilter");
var stateFilter = document.getElementById("stateFilter");

partyFilters = [democratFilter, republicanFilter, independentFilter];

//add event listeners to all party checkboxes to filter when clicked
//and set all to checked when page is loaded
for(var i = 0; i < partyFilters.length; i++) {
  partyFilters[i].addEventListener("click", function() {
    createTable(filter());
  })
  partyFilters[i].checked = true;
}

stateFilter.addEventListener("change", function() {
  createStateTags("none");
  createTable(filter());
})

populateStateOptions();

//ensure all states are selected when loading page
stateFilter.selectedIndex = "0";
createStateTags("none");

createTable(membersPath);

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

// This function creates tags based on whch states are selected. It's argument takes
// an exception, which is generated when a state tag is exed-out. If you are just adding
// states and not removing, the argument should be "none".
function createStateTags(exception) {
  tagDiv = document.getElementById("state-tag-container");
  var existingTags = Array.from(document.getElementsByClassName("state-name")).map(elt => elt.innerHTML);
  var selectedStates = Array.from(document.querySelectorAll('#stateFilter option:checked')).map(opt => opt.value);
  // in the case that a tag has been ex'd out:
  if (exception != "none") {
    tagDiv.innerHTML = "";
    selectedStates = existingTags;
    var exceptionIndex = selectedStates.indexOf(exception);
    selectedStates.splice(exceptionIndex, 1);
  }
  console.log("selectedStates: ", selectedStates);
  if (selectedStates.includes("All")) {
      tagDiv.innerHTML = "";
      selectedStates = Array.from(document.querySelectorAll('#stateFilter option')).map(opt => opt.value);
      //get rid of "all" in the array
      selectedStates.splice(0, 1);
    }
  for (var i = 0; i < selectedStates.length; i++) {
    if ( (exception == "none" && !existingTags.includes(selectedStates[i]) ) ||
    exception != "none") {
      var stateTag = document.createElement("div");
      stateTag.className = "state-tag";
      var stateName = document.createElement("div");
      stateName.className = "state-name";
      var tagX = document.createElement("button");
      tagX.className = "tag-x";
      tagX.addEventListener("click", function() {
        removeTag();
      });
      stateName.innerHTML = selectedStates[i];
      tagX.innerHTML = "x";
      stateTag.appendChild(stateName);
      stateTag.appendChild(tagX);
      tagDiv.appendChild(stateTag);
    }
  }
}

function removeTag() {
  console.log(event.target.parentElement);
  var stateTag = event.target.parentElement;
  var removedStateName = stateTag.childNodes[0].innerText;
  createStateTags(removedStateName);
  createTable(filter());
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

function filter() {
  filteredMembersArray = [];
  //get all checked party values
  partyFilters = Array.from(document.querySelectorAll('input[name=party]:checked')).map(elt => elt.value);
  //get all selected state values from existing state tags
  var stateFilters = Array.from(document.getElementsByClassName("state-name")).map(elt => elt.innerHTML);
  console.log("stateFilters: ", stateFilters);
  for (var i = 0; i < membersPath.length; i++) {
      if (partyFilters.includes(membersPath[i].party) &&
      (stateFilters.includes(membersPath[i].state) || stateFilters.includes("All"))) {
        filteredMembersArray.push(membersPath[i]);
      }
    }
  return filteredMembersArray;
}

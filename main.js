
//------------------Congress 113 Senate/House Pages-------------------------//
var membersPath = congressData.results[0].members;
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
  createTable(filter());
})

populateStateOptions();
createTable(membersPath);

function populateStateOptions() {
  var states = [];
  var select = document.getElementById("stateFilter");
  for (var i = 0; i < membersPath.length; i++) {
    if (!states.includes(membersPath[i].state)) {
      states.push(membersPath[i].state);
    }
  }
  states = states.sort();
  states.unshift("All");
  for (var i = 0; i < states.length; i++) {
    var option = document.createElement('option');
    option.value = states[i];
    option.innerHTML = states[i];
    select.appendChild(option);
  }
}

//ensure all states are selected when loading page
stateFilter.selectedIndex = "0";

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
  //get all selected state values
  stateFilters = Array.from(document.querySelectorAll('#stateFilter option:checked')).map(opt => opt.value);
  for (var i = 0; i < membersPath.length; i++) {
      if (partyFilters.includes(membersPath[i].party) &&
      (stateFilters.includes(membersPath[i].state) || stateFilters.includes("All"))) {
        filteredMembersArray.push(membersPath[i]);
        console.log(membersPath[i].party, membersPath[i].state);
      }
    }
  return filteredMembersArray;
}

//------------------Attendance and Party Loyalty Pages-------------------------//

var democratMembers = [];
var republicanMembers = [];
var independentMembers = [];

for(var i = 0; i < membersPath.length; i++){
  if(membersPath[i].party == "D"){
    democratMembers.push(membersPath[i]);
  }
  if(membersPath[i].party == "R"){
    republicanMembers.push(membersPath[i]);
  }
  if(membersPath[i].party == "I"){
  independentMembers.push(membersPath[i]);
  }
}

var statistics = {
    "numberOfDemocrats":democratMembers.length,
    "numberOfRepublicans":republicanMembers.length,
    "numberOfIndependents":independentMembers.length,
    "averageDemocratLoyalty":calculateAverageLoyalty("D"),
    "averageRepublicanLoyalty":calculateAverageLoyalty("R"),
    "mostMissedVotes":getPercent("missed_votes_pct","top",.1),
    "leastMissedVotes":getPercent("missed_votes_pct","bottom",.1),
    "mostLoyal":getPercent("votes_with_party_pct","top",.1),
    "leastLoyal":getPercent("votes_with_party_pct","bottom",.1)
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function calculateAverageLoyalty(party) {
  var loyaltyPercentageArray = []
  for(var i = 0; i < membersPath.length; i++) {
    if(party == membersPath[i].party){
      // console.log(membersPath[i].votes_with_party_pct);
      loyaltyPercentageArray.push(membersPath[i].votes_with_party_pct);
    }
  }
  average = loyaltyPercentageArray.reduce(function(a,b){return a + b}, 0) / loyaltyPercentageArray.length;
  return average;
}

function getPercent(property, direction, percent) {
  var percentArray = [];
  if (direction == "top") {
    var sortedMembers = [...membersPath].sort(dynamicSort("-" + property));
  }
  if (direction == "bottom") {
    var sortedMembers = [...membersPath].sort(dynamicSort(property));
  }
  for (var i = 0; i < sortedMembers.length; i++) {
    if ((i + 1) / sortedMembers.length <= percent) {
      percentArray.push(sortedMembers[i]);
    }
    else {
      if (sortedMembers[i][property] == sortedMembers[i - 1][property]) {
        percentArray.push(sortedMembers[i]);
      }
      else {
        break;
      }
    }
  }
  return percentArray;
}



//scratch area
console.log(statistics);

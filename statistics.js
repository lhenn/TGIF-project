//------------------Attendance and Party Loyalty Pages-------------------------//
var membersPath = congressData.results[0].members;

var overviewStats = {
  "democrats": {
    "partyName":"Democratic",
    "numberOfMembers":getNumberOfMembers("D"),
    "averageLoyalty":calculateAverageLoyalty("D")
  },
  "republicans": {
    "partyName":"Republican",
    "numberOfMembers":getNumberOfMembers("R"),
    "averageLoyalty":calculateAverageLoyalty("R")
  },
  "independents": {
    "partyName":"Independent",
    "numberOfMembers":getNumberOfMembers("I"),
    "averageLoyalty":calculateAverageLoyalty("I")
  },
  "total": {
    "partyName":"Total",
    "numberOfMembers": getNumberOfMembers("all"),
    "averageLoyalty": calculateAverageLoyalty("all")
  }
}

var percentStats = {
    "mostMissedVotes":getPercent("missed_votes_pct","top",.1),
    "leastMissedVotes":getPercent("missed_votes_pct","bottom",.1),
    "mostLoyal":getPercent("votes_with_party_pct","top",.1),
    "leastLoyal":getPercent("votes_with_party_pct","bottom",.1)
}

// Create "at a glance" table on both attendance and party loyalty pages.
createOverviewTable();
// Then, figure out if the script is being ran on attendance or party loyalty page
// and make appropriate tables.
if(/attendance+/.test(document.title)) {
  createPercentTable("mostMissedVotes", "most-missed-table");
  createPercentTable("leastMissedVotes", "least-missed-table");
}
if(/partyloyalty+/.test(document.title)) {
  createPercentTable("mostLoyal", "most-loyal-table");
  createPercentTable("leastLoyal", "least-loyal-table");
}


// This creates the "at a glance" tables on all attendance and party loyalty pages.
function createOverviewTable() {
  var table = document.getElementById('overview-table');
  var tbody = document.getElementById("overview-table-body");
  var text = "";
  for(var x in overviewStats) {
    var tr = document.createElement("tr");
    tr.insertCell().innerHTML = overviewStats[x].partyName;
    tr.insertCell().innerHTML = overviewStats[x].numberOfMembers;
    tr.insertCell().innerHTML = overviewStats[x].averageLoyalty + "%";
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
}

// This builds tables based on top and bottom 10% statistics. It takes an appropriate
// key from the statistics object as the first argument (e.g. 'mostMissedVotes') and the
// html table id where it should be created as the second argument (e.g. 'most-missed-table').
function createPercentTable(stat, table_id) {
  var table = document.getElementById(table_id);
  var tbody = document.getElementById(table_id + "-body");
  for(var i = 0; i < percentStats[stat].length; i++){
    var tr = document.createElement("tr");
    tr.insertCell().innerHTML = percentStats[stat][i].first_name + " " + percentStats[stat][i].last_name;
    if(/MissedVotes+/.test(stat)) {
      tr.insertCell().innerHTML = percentStats[stat][i].missed_votes;
      tr.insertCell().innerHTML = percentStats[stat][i].missed_votes_pct + "%";
    }
    if(/Loyal+/.test(stat)) {
      tr.insertCell().innerHTML = percentStats[stat][i].total_votes;
      tr.insertCell().innerHTML = percentStats[stat][i].votes_with_party_pct + "%";
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
}

// party argument takes "D", "R", "I", or "all"
function getNumberOfMembers(party) {
  var count = 0;
  for(var i = 0; i < membersPath.length; i++){
    if(party == "all"){
    count += 1;
    } else if (party == membersPath[i].party) {
    count += 1;
    }
  }
  return count;
}

//takes "D", "R", "I", or "all" as party argument
function calculateAverageLoyalty(party) {
  var loyaltyPercentageArray = [];
  for(var i = 0; i < membersPath.length; i++) {
    if (party == "all") {
      loyaltyPercentageArray.push(membersPath[i].votes_with_party_pct);
    } else if (party == membersPath[i].party) {
      loyaltyPercentageArray.push(membersPath[i].votes_with_party_pct);
    }
  }
  average = loyaltyPercentageArray.reduce(function(a,b){return a + b}, 0) / loyaltyPercentageArray.length;
  if (isNaN(average))
    average = 0;
  return average.toFixed(2);
}

//this is a helper function for getPercent(). It allows you to sort objects
//by specific keys (properties) and in specific directions ("-property" reverses sort order)
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

// function takes object key from membersPath as first argument (e.g. 'missed_votes_pct'),
// 'top' or 'bottom' as second argument, and percent as third element.
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
    } else if (sortedMembers[i][property] == sortedMembers[i - 1][property]) {
        percentArray.push(sortedMembers[i]);
    } else {
        break;
    }
  }
  return percentArray;
}

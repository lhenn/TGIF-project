const app = new Vue({
  el: '#app',
  data: {
    dataLoaded:false,
    membersPath: {},
    overviewStats: {},
    percentStats: {},
    tableDisplayed: "most",
    mostTableDisplayed: true,
    isRepublican: true

  },
  created: function(){
    this.getData()
  },
  methods: {
    getData: function() {
      if(/house+/.test(document.title)) {
        var propublicaURL = "https://api.propublica.org/congress/v1/113/house/members.json";
      }
      if(/senate+/.test(document.title)) {
        var propublicaURL = "https://api.propublica.org/congress/v1/113/senate/members.json";
      }
      var propublicaAPIkey = 'E58FNEqHGDgcK00Ty0XoyVpupxkLQXMc3okUc8EU';
        fetch(propublicaURL, {
                method: "GET",
                headers: new Headers({
                "X-API-KEY":propublicaAPIkey
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                app.dataLoaded = true;
                app.membersPath = json.results[0].members;
                app.overviewStats = {
                  democrats: {
                    partyName:"Democratic",
                    numberOfMembers:app.getNumberOfMembers(app.membersPath, "D"),
                    averageLoyalty:app.calculateAverageLoyalty(app.membersPath, "D")
                  },
                  republicans: {
                    partyName:"Republican",
                    numberOfMembers:app.getNumberOfMembers(app.membersPath, "R"),
                    averageLoyalty:app.calculateAverageLoyalty(app.membersPath, "R")
                  },
                  independents: {
                    partyName:"Independent",
                    numberOfMembers:app.getNumberOfMembers(app.membersPath, "I"),
                    averageLoyalty:app.calculateAverageLoyalty(app.membersPath, "I")
                  },
                  total: {
                    partyName:"Total",
                    numberOfMembers: app.getNumberOfMembers(app.membersPath, "all"),
                    averageLoyalty: app.calculateAverageLoyalty(app.membersPath, "all")
                  }
                }
                app.percentStats = {
                    mostMissedVotes:app.getPercent(app.membersPath, "missed_votes_pct","top",.1),
                    leastMissedVotes:app.getPercent(app.membersPath, "missed_votes_pct","bottom",.1),
                    mostLoyal:app.getPercent(app.membersPath, "votes_with_party_pct","top",.1),
                    leastLoyal:app.getPercent(app.membersPath, "votes_with_party_pct","bottom",.1)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    getNumberOfMembers:function(data, party) {
      var count = 0;
      for(var i = 0; i < data.length; i++){
        if(party == "all"){
        count += 1;
      } else if (party == data[i].party) {
        count += 1;
        }
      }
      return count;
    },
    calculateAverageLoyalty:function(data, party) {
      var loyaltyPercentageArray = [];
      for(var i = 0; i < data.length; i++) {
        if (party == "all") {
          loyaltyPercentageArray.push(data[i].votes_with_party_pct);
        } else if (party == data[i].party) {
          loyaltyPercentageArray.push(data[i].votes_with_party_pct);
        }
      }
      average = loyaltyPercentageArray.reduce(function(a,b){return a + b}, 0) / loyaltyPercentageArray.length;
      if (isNaN(average))
        average = 0;
      return average.toFixed(2);
    },
    getPercent:function(data, property, direction, percent) {
      var percentArray = [];
      if (direction == "top") {
        var sortedMembers = [...data].sort(app.dynamicSort("-" + property));
      }
      if (direction == "bottom") {
        var sortedMembers = [...data].sort(app.dynamicSort(property));
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
    },
    dynamicSort:function(property) {
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
    }
})

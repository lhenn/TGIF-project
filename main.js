const app = new Vue({
  el: '#app',
  data: {
    dataIsLoading: true,
    membersPath: {},
    isCollapsed: true,
    parties: ["Democratic", "Republican", "Independent"],
    states: [],
    selectedParties: [],
    selectedStates: [],
    filteredMembers: {},
    activeTag: 'active-tag',
    stateTag: 'state-tag',
    partyTag: 'party-tag'
  },
  created: function() {
    this.getData();
  },
  methods: {
    getData: function() {
      if (/house+/.test(document.title)) {
        var propublicaURL = "https://api.propublica.org/congress/v1/113/house/members.json";
      }
      if (/senate+/.test(document.title)) {
        var propublicaURL = "https://api.propublica.org/congress/v1/113/senate/members.json";
      }
      var propublicaAPIkey = 'E58FNEqHGDgcK00Ty0XoyVpupxkLQXMc3okUc8EU';
      fetch(propublicaURL, {
          method: "GET",
          headers: new Headers({
            "X-API-KEY": propublicaAPIkey
          })
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          app.dataIsLoading = false;
          app.membersPath = json.results[0].members;
          app.states = app.getStates(app.membersPath);
          app.filteredMembers = app.membersPath;
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    getStates: function(data) {
      var statesArray = [];
      for (var i = 0; i < data.length; i++) {
        if (!statesArray.includes(data[i].state)) {
          statesArray.push(data[i].state);
        }
      }
      statesArray.sort();
      return (statesArray);
    },
    toggleActivity: function(value) {
      console.log(value)
      if (event.target.classList.contains("state-tag")) {
        if (!this.selectedStates.includes(value)) {
          this.selectedStates.push(value);
        }
        else {
          let index = this.selectedStates.indexOf(value);
          this.selectedStates.splice(index, 1);
        }
      }
      if (event.target.classList.contains("party-tag")) {
        if (!this.selectedParties.includes(value))
          this.selectedParties.push(value);
        else {
          let index = this.selectedParties.indexOf(value);
          this.selectedParties.splice(index, 1);
        }
      }
    },
    selectAllTags: function(tagType) {
      if(tagType == "party") {
        this.selectedParties = [...this.parties];
      }
      if(tagType == "state") {
        this.selectedStates = [...this.states];
      }
    },
    deselectAllTags: function(tagType) {
      if(tagType == "party") {
        this.selectedParties = [];
      }
      if(tagType == "state") {
        this.selectedStates = [];
      }
    },
    filterData: function() {
      app.filteredMembers = [];
      partyKeys = [];
      for(i = 0; i < app.selectedParties.length; i++) {
        if(app.selectedParties[i] == "Democratic") {
          partyKeys.push("D");
        }
        if(app.selectedParties[i] == "Republican") {
          partyKeys.push("R");
        }
        if(app.selectedParties[i] == "Independent") {
          partyKeys.push("I");
        }
      }
      for(i = 0; i < app.membersPath.length; i++) {
        if( partyKeys.includes(app.membersPath[i].party) && app.selectedStates.includes(app.membersPath[i].state) ) {
          app.filteredMembers.push(app.membersPath[i]);
      }
    }
  }
}
})

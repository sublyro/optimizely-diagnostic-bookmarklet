javascript: (function() {
  if (typeof optimizely === 'undefined') {
    alert("Optimizely is not setup on this page");
  } else { 
    console.group("Optimizely");
    var e = optimizely.activeExperiments;
    var res = "";
    console.log("Project Id: " + optimizely.getProjectId() +" https://www.optimizely.com/s/do/redirect-to-impersonate?input=" +optimizely.getProjectId());
    console.log("Snippet revision: " + optimizely.revision);
    console.groupEnd();
    res += "\nAB Testing: \n";
    if (e.length > 0) {
      experiments = optimizely.activeExperiments;
      for (var i = 0; i < experiments.length; i++) {
        res += "Experiment '" + optimizely.allExperiments[experiments[i]].name + "' (" +experiments[i] +")' -> '" + optimizely.variationNamesMap[experiments[i]] + "' (" +optimizely.variationIdsMap[experiments[i]] +")\n";
      }
    } else {
      res += "There are no Optimizely AB experiment running on this page\n";
    } 
    
    res += "\nNew Optimizely:\n";
    console.group("New Optimizely");
    
    if (typeof optimizely.get === 'function') {
      console.group("Active Pages");
      if (optimizely.get('state') !== undefined) {
      	var hasRunningPages = false;
        Object.keys(optimizely.get('state').getPageStates()).forEach(function(k, i) {
          var page = optimizely.get('state').getPageStates()[k];
          if (page.isActive) {
          	hasRunningPages = true;
            console.groupCollapsed(page.name +" (" +page.id +")");
            console.log(page.name);
            console.log(page.id);
            console.log("https://app.optimizely.com/v2/projects/" +optimizely.getProjectId() +"/implementation/pages/" +page.id);
            if (Object.keys(page.metadata).length > 0) {
              console.groupCollapsed("Tags");
              for (var property in page.metadata) {
                if (page.metadata.hasOwnProperty(property)) {
                  console.log(property + " : " + page.metadata[property]);
                }
              }
              console.groupEnd();
            }
            console.groupEnd();
          }
        });
        if (!hasRunningPages) {
          console.log("There are no active pages");
        }
        console.groupEnd();

        console.group("Campaigns");
        var hasRunningCampaigns = false;
        var p13n = [];
        var ab = [];
        Object.keys(optimizely.get('state').getCampaignStates()).forEach(function(k, i) {
          var campaign = optimizely.get('state').getCampaignStates()[k];
          
          if (campaign.experiment !== null) {
          	hasRunningCampaigns = true;
            experiment = campaign.experiment;
            
            Object.keys(optimizely.get('data').campaigns[campaign.id].experiments).forEach(function(e, j) {
              var tmp = optimizely.get('data').campaigns[campaign.id].experiments[e];
              if (tmp.id == experiment.id) {
                var type = optimizely.get('data').campaigns[campaign.id].policy == 'ordered' ? "P13N" : "AB";
                var variation = "";
                if (optimizely.get('data').campaigns[campaign.id].policy == 'random') {
                  ab.push([campaign.campaignName, campaign.id,tmp.audienceName,tmp.id,campaign.variation.name,campaign.variation.id]);
                } else {
                  p13n.push([campaign.campaignName ,campaign.id,tmp.audienceName,tmp.id]);
                }
              }
            });
          }
        });
        if (!hasRunningCampaigns) {
        	res += "There are no active campaigns\n";
        }
        console.group("AB");
        for (var i=0; i < ab.length; i++) {
          console.groupCollapsed(ab[i][0] +" (" +ab[i][1] +") / " +ab[i][2] +" (" +ab[i][3] +") / " +ab[i][4] +" (" +ab[i][5] +")");
          console.log("Campaign " +ab[i][0] +" (" +ab[i][1] +") https://app.optimizely.com/v2/projects/" +optimizely.getProjectId() +"/campaigns/" +ab[i][1]);
          console.log("Experience " +ab[i][2] +" (" +ab[i][3] +")");
          console.log("Variation " +ab[i][4] +" (" +ab[i][5] +")");
          console.groupEnd();
        }
        console.groupEnd();
        console.group("P13N");
        for (var i=0; i < p13n.length; i++) {
          console.groupCollapsed(p13n[i][0] +" (" +p13n[i][1] +") / " +p13n[i][2] +" (" +p13n[i][3] +")");
          console.log("Campaign " +p13n[i][0] +" (" +p13n[i][1] +") https://app.optimizely.com/v2/projects/" +optimizely.getProjectId() +"/campaigns/" +p13n[i][1]);
          console.log("Experience " +p13n[i][2] +" (" +p13n[i][3] +")");
          console.groupEnd();
        }
        console.groupEnd();
        
      }
    } else {
    } 
    console.groupEnd();
  }
  console.groupEnd();
})()

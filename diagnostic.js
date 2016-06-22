javascript: (function() {
  if (typeof optimizely === 'undefined') {
    alert("Optimizely is not setup on this page");
  } else { /* AB */
    console.group("Optimizely");
    var e = optimizely.activeExperiments;
    var res = "";
    //res += "Project Id: " + optimizely.getProjectId() + "\n";
    console.log("Project Id: " + optimizely.getProjectId() +" https://www.optimizely.com/s/do/redirect-to-impersonate?input=" +optimizely.getProjectId());
    console.log("Snippet revision: " + optimizely.revision);
    //res += "Snippet revision: " + optimizely.revision + "\n";
    console.groupEnd();
    res += "\nAB Testing: \n";
    if (e.length > 0) {
      experiments = optimizely.activeExperiments;
      for (var i = 0; i < experiments.length; i++) {
        res += "Experiment '" + optimizely.allExperiments[experiments[i]].name + "' (" +experiments[i] +")' -> '" + optimizely.variationNamesMap[experiments[i]] + "' (" +optimizely.variationIdsMap[experiments[i]] +")\n";
      }
    } else {
      res += "There are no Optimizely AB experiment running on this page\n";
    } /* P13N */
    
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
            //res += "Page '" + page.name + "' (" + page.id + ") is active\n";
            //console.log("Page '" + page.name + "' (" + page.id + ") is active");
            console.groupCollapsed(page.name +" (" +page.id +")");
            console.log(page.name);
            console.log(page.id);
            console.log("https://app.optimizely.com/v2/projects/" +optimizely.getProjectId() +"/implementation/pages/" +page.id);
            if (Object.keys(page.metadata).length > 0) {
              console.groupCollapsed("Tags");
              for (var property in page.metadata) {
                if (page.metadata.hasOwnProperty(property)) {
                  //res += '\t' + property + " : " + page.metadata[property] + "\n";
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
        	//res += "There are no active pages\n";
        }
        console.groupEnd();

        console.group("Campaigns");
        //res += "\n";
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
                //res += type +" Campaign '" + campaign.campaignName + "' (" + campaign.id + ") is active with experience '" + tmp.audienceName + "' (" + tmp.id + ")";
                var variation = "";
                if (optimizely.get('data').campaigns[campaign.id].policy == 'random') {
                  //res += " and variation '" +campaign.variation.name +"' (" +campaign.variation.id +")";
                  ab.push(campaign.campaignName + "' (" + campaign.id + ") is active with experience '" + tmp.audienceName + "' (" + tmp.id + ") and variation '" +campaign.variation.name +"' (" +campaign.variation.id +")");
                } else {
                  p13n.push(campaign.campaignName + "' (" + campaign.id + ") is active with experience '" + tmp.audienceName + "' (" + tmp.id + ")");
                }
                //res += "\n";
                //var variation = optimizely.get('data').campaigns[campaign.id].policy == 'ordered' ? "" : campaign.variation.name;
                //var variation = campaign.variation;
                //res += type +" Campaign '" + campaign.campaignName + "' (" + campaign.id + ") is active with experience '" + tmp.audienceName + "' (" + tmp.id + ") and variation >>" +variation +"<<\n";
              }
            });
          }
        });
        if (!hasRunningCampaigns) {
        	res += "There are no active campaigns\n";
        }
        console.log(ab);
        console.group("AB");
        for (var i in ab) {
          console.log(ab[i]);
        }
        console.groupEnd();
        console.group("P13N");
        console.log(p13n);
        console.groupEnd();
        
      }
    } else {
      res += "New Optimizely is not running on this page\n";
    } /*window.alert(res);*/
    console.groupEnd();
    window.console.log("************************************\n" + res + "\n************************************\n");
  }
})()

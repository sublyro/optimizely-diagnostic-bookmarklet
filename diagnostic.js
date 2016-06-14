javascript: (function() {
  if (typeof optimizely === 'undefined') {
    alert("Optimizely is not setup on this page");
  } else { /* AB */
    var e = optimizely.activeExperiments;
    var res = "";
    res += "Project Id: " + optimizely.getProjectId() + "\n";
    res += "Snippet revision: " + optimizely.revision + "\n";
    res += "\nAB Testing: \n";
    if (e.length > 0) {
      experiments = optimizely.activeExperiments;
      for (var i = 0; i < experiments.length; i++) {
        res += "Experiment '" + optimizely.allExperiments[experiments[i]].name + "' (" +experiments[i] +")' -> '" + optimizely.variationNamesMap[experiments[i]] + "' (" +optimizely.variationIdsMap[experiments[i]] +")\n";
      }
    } else {
      res += "There are no Optimizely AB experiment running on this page\n";
    } /* P13N */
    res += "\nP13N:\n";
    if (typeof optimizely.get === 'function') {
      if (optimizely.get('state') !== undefined) {
      	var hasRunningPages = false;
        Object.keys(optimizely.get('state').getPageStates()).forEach(function(k, i) {
          var page = optimizely.get('state').getPageStates()[k];
          if (page.isActive) {
          	hasRunningPages = true;
            res += "Page '" + page.name + "' (" + page.id + ") is active\n";
            for (var property in page.metadata) {
              if (page.metadata.hasOwnProperty(property)) {
                res += '\t' + property + " : " + page.metadata[property] + "\n";
              }
            }
          }
        });
        if (!hasRunningPages) {
        	res += "There are no active pages\n";
        }
        res += "\n";
        var hasRunningCampaigns = false;
        Object.keys(optimizely.get('state').getCampaignStates()).forEach(function(k, i) {
          var campaign = optimizely.get('state').getCampaignStates()[k];
          if (campaign.experiment !== null) {
          	hasRunningCampaigns = true;
            experiment = campaign.experiment;
            Object.keys(optimizely.get('data').campaigns[campaign.id].experiments).forEach(function(e, j) {
              var tmp = optimizely.get('data').campaigns[campaign.id].experiments[e];
              if (tmp.id == experiment.id) {
                res += "Campaign '" + campaign.campaignName + "' (" + campaign.id + ") is active with experience '" + tmp.audienceName + "' (" + tmp.id + ")\n";
              }
            });
          }
        });
        if (!hasRunningCampaigns) {
        	res += "There are no active campaigns\n";
        }
      }
    } else {
      res += "Optimizely P13N is not running on this page\n";
    } /*window.alert(res);*/
    window.console.log("************************************\n" + res + "\n************************************\n");
  }
})()

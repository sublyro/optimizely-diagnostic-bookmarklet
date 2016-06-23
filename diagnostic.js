javascript: (function() {
  if (typeof optimizely === 'undefined') {
    alert("Optimizely is not setup on this page");
  } else {
    console.group("Optimizely");
    var e = optimizely.activeExperiments;
    console.log("Project Id: " + optimizely.getProjectId() + " https://www.optimizely.com/s/do/redirect-to-impersonate?input=" + optimizely.getProjectId());
    console.log("Snippet revision: " + optimizely.revision);

    if (optimizely.data.state.redirectExperiment !== undefined) {
      console.group("Active redirect experiment");
      console.groupCollapsed("'" + optimizely.allExperiments[optimizely.data.state.redirectExperiment.experimentId].name + "' (" + optimizely.data.state.redirectExperiment.experimentId + ") / '" + optimizely.variationNamesMap[optimizely.data.state.redirectExperiment.experimentId] + "' (" + optimizely.data.state.redirectExperiment.variationId + ")");
      console.log("Experiment '" + optimizely.allExperiments[optimizely.data.state.redirectExperiment.experimentId].name + "' (" + optimizely.data.state.redirectExperiment.experimentId + ") https://www.optimizely.com/s/do/redirect-to-impersonate?input=" + optimizely.data.state.redirectExperiment.experimentId);
      console.log("Variation '" + optimizely.variationNamesMap[optimizely.data.state.redirectExperiment.experimentId] + "' (" + optimizely.data.state.redirectExperiment.variationId + ")");
      console.groupEnd(); /* Experiment */
      console.groupEnd(); /* Redirect Experiment */
    }

    console.group("AB");
    if (e.length > 0) {
      experiments = optimizely.activeExperiments;
      for (var i = 0; i < experiments.length; i++) {
        console.groupCollapsed("'" + optimizely.allExperiments[experiments[i]].name + "' (" + experiments[i] + ") / '" + optimizely.variationNamesMap[experiments[i]] + "' (" + optimizely.variationIdsMap[experiments[i]] + ")");
        console.log("Experience '" + optimizely.allExperiments[experiments[i]].name + "' (" + experiments[i] + ") https://www.optimizely.com/s/do/redirect-to-impersonate?input=" + experiments[i]);
        console.log("Variation '" + optimizely.variationNamesMap[experiments[i]] + "' (" + optimizely.variationIdsMap[experiments[i]] + ")");
        console.groupEnd(); /* AB */
      }
    } else {
      console.log("There are no Optimizely AB experiment running on this page");
    }
    console.groupEnd(); /* AB */
    console.groupEnd(); /* Optimizely */

    if (typeof optimizely.get === 'function') {
      console.group("New Optimizely");
      console.group("Active Pages");
      if (optimizely.get('state') !== undefined) {
        var hasRunningPages = false;
        Object.keys(optimizely.get('state').getPageStates()).forEach(function(k, i) {
          var page = optimizely.get('state').getPageStates()[k];
          if (page.isActive) {
            hasRunningPages = true;
            console.groupCollapsed("'" +page.name + "' (" + page.id + ")");
            console.log("https://app.optimizely.com/v2/projects/" + optimizely.getProjectId() + "/implementation/pages/" + page.id);
            if (Object.keys(page.metadata).length > 0) {
              console.groupCollapsed("Tags");
              for (var property in page.metadata) {
                if (page.metadata.hasOwnProperty(property)) {
                  console.log(property + " : " + page.metadata[property]);
                }
              }
              console.groupEnd(); /* Tags */
            }
            console.groupEnd(); /* Page */
          }
        });
        if (!hasRunningPages) {
          console.log("There are no active pages");
        }
        console.groupEnd(); /* Active Pages */

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
                  ab.push([campaign.campaignName, campaign.id, tmp.audienceName, tmp.id, campaign.variation.name, campaign.variation.id]);
                } else {
                  p13n.push([campaign.campaignName, campaign.id, tmp.audienceName, tmp.id]);
                }
              }
            });
          }
        });
        if (!hasRunningCampaigns) {
          console.log("There are no campaigns");
        } else {
          console.group("AB");
          for (var i = 0; i < ab.length; i++) {
            console.groupCollapsed("'" + ab[i][0] + "' (" + ab[i][1] + ") / '" + ab[i][2] + "' (" + ab[i][3] + ") / '" + ab[i][4] + "' (" + ab[i][5] + ")");
            console.log("Campaign '" + ab[i][0] + "' (" + ab[i][1] + ") https://app.optimizely.com/v2/projects/" + optimizely.getProjectId() + "/campaigns/" + ab[i][1]);
            console.log("Experience '" + ab[i][2] + " (" + ab[i][3] + ")");
            console.log("Variation '" + ab[i][4] + " (" + ab[i][5] + ")");
            console.groupEnd(); /* AB */
          }
          console.groupEnd();
          console.group("P13N");
          for (var i = 0; i < p13n.length; i++) {
            console.groupCollapsed("'" + p13n[i][0] + "' (" + p13n[i][1] + ") / '" + p13n[i][2] + "' (" + p13n[i][3] + ")");
            console.log("Campaign '" + p13n[i][0] + "' (" + p13n[i][1] + ") https://app.optimizely.com/v2/projects/" + optimizely.getProjectId() + "/campaigns/" + p13n[i][1]);
            console.log("Experience '" + p13n[i][2] + "' (" + p13n[i][3] + ")");
            console.groupEnd(); /* P13N */
          }
        }
        console.groupEnd(); /* Campaigns */

      }
      console.groupEnd(); /* New Optimizely */
    }
  }
})()

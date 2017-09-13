myApp.service('ClientService', function ($http, $location) {
  console.log('ClientService Loaded');
  var self = this;

  self.currentClient = {
    client: []
};

  self.clientList = {
    list: []
  };

  // called from client-related controllers (manage-client) on page load. sets self.currentClient to the whole client object 
  self.getCurrentClient = (clientId) => {
    console.log('ClientService.getClient', clientId);

    if (clientId != undefined) {
      $http.get('/client/' + clientId).then((response) => {
        console.log('ClientService.getClient GET response', response);
        self.currentClient.client = response.data;
        console.log('ClientService.currentClient', self.currentClient);
      });
    } else {
      console.log('ClientService.getClient needs a clientId! bail out!');
    }
  };

  // called from the manage-client view, takes in a whole client object and sends it to the ol' server
  self.editCurrentClient = (client) => {
    console.log('ClientService.editCurrentClient()', client);

    // this if should never fail, ideally. and as we all know, everything is always ideal
    if(client._id != undefined){
      $http.put('/client', client).then((response => {
        // success
        console.log('client edited');
      }), (response) => {
        // server error
        console.log('/client PUT server error:', response);
      })
    } else {
      // sad path
      console.log('ClientService.editClient needs a client! bail out!');
    }
    
  } // end editCurrentClient()

  self.getClientList = () => {
    console.log('ClientService.getClient');

    $http.get('/client/list').then((response) => {
      console.log('client GET response', response);
      self.clientList.list = response.data;
      console.log('ClientService.clientList', self.clientList);
    });
  };

  self.addClient = (client) => {
    console.log('ClientService.addClient', client);

    let now = new Date();
    let then = new Date(client.date_of_birth);
    let timeDelta = Math.abs(now.getTime() - then.getTime());
    let ageInDays = Math.ceil(timeDelta / (1000 * 3600 * 24));

    // console.log('ageInDays', ageInDays);

    switch (true) {
      case (ageInDays <= 182):
        client.age = 'newborn';
        break;
      case (182 < ageInDays && ageInDays <= 365):
        client.age = 'infant';
        break;
      case (365 < ageInDays && ageInDays <= 730):
        client.age = 'oneyear';
        break;
      case (730 < ageInDays && ageInDays <= 1095):
        client.age = 'twoyear';
        break;
      case (1095 < ageInDays && ageInDays <= 1460):
        client.age = 'threeyear';
        break;
      case (1460 < ageInDays && ageInDays <= 1825):
        client.age = 'fouryear';
        break;
      default:
        client.age = 'older'
    }

    console.log('client age after calc', client.age);

    $http.post('/client', client).then((response) => {
      console.log('/client POST response', response);
    });
  }

  // called from manage-client view by the user clicking a button. 
  // comes from manage-client.controller.js. 
  // only available if the user IS the primary caregiver. does what it says
  self.deleteCurrentClient = () => {
    console.log('ClientService.deleteCurrentClient() _id:', self.currentClient._id);

    $http.delete('/client/' + self.currentClient._id).then((response) => {
      // success
      console.log('client deleted');
    }, (response) => {
      // failure - if this happens it's a serious error, the intended workflow does not include this possibility
      console.log('client delete error, something is wrong');
    })
  }; // end deleteCurrentClient()


  // ------- LEAVE CLIENT IS NOT YET IMPLEMENTED -------
  // ------- NEEDS SECONDARY CAREGIVER LOGIC, WHICH IS FOR LATER --------

  // called from manage-client view by the user clicking a button. 
  // comes from manage-client.controller.js. 
  // only available if the user IS NOT the primary caregiver. removes the user as a secondary caregiver of the current client
  self.leaveCurrentClient = () => {
    console.log('ClientService.leaveCurrentClient() _id:', self.currentClient._id);

    $http.put('/client/' + self.currentClient._id).then((response) => {
      // success
      console.log('client left');
    }, (response) => {
      // failure - if this happens it's a serious error, the intended workflow does not include this possibility
      console.log('client leave error, something is wrong');
    })
  }; // end leaveCurrentClient()
})
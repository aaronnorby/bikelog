require('./login');

let userBike;

// If there's no api token, forget the whole thing
if (!window.localStorage.getItem('bikelock')) {
  document.body.innerHTML = `<p class="unauthorized">You don't have an auth token. Try logging in again.</p>`;
}

function createMaintEvent(eventType, date, note='') {
  // date needs to be sent YYYY-MM-DD-HH-mm in UTC
  if (!eventType) return;
  const token = window.localStorage.getItem('bikelock');
  if (!token) {
    alert("You don't have an auth token. Log in.");
    return;
  }

  if (!userBike) {
    alert("You need to fetch your bike first.");
    return;
  }

  let data = {
    'bike_id': userBike.id,
    date: date,
    description: eventType,
  };

  if (note !== '') {
    data.note = note;
  }

  fetch(`/api/maintenance_events`, {
    method: 'post',
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log('Success. Data: ', data);
  })
  .catch(function(err) {
    console.log('err posting event: ', err);
  });
}



const getDistance = (e) => {
  let eventType = document.getElementById('event').value;
  if (eventType === "") {
    return;
  }

  const token = window.localStorage.getItem('bikelock');
  if (!token) {
    alert("You don't have an auth token. Try going to /login' and log in.");
    return;
  }

  if (!userBike) {
    alert("You haven't fetched your bike info. Hit the button.");
    return;
  }

  console.log(`fetching distance since last ${eventType} event`);

  fetch(`/api/maintenance_event/distance/${userBike.id}?type=${eventType}`, {
    method: 'get',
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(function(resp) {
    if (resp.status !== 200) {
      return Promise.reject(new Error(resp.statusText));
    } else {
      return Promise.resolve(resp);
    }
  })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log(data);
    const infoP = document.getElementsByClassName("distance-info")[0];
    infoP.textContent = `Distance since last ${eventType}: ${data.miles} miles. Found: ${data.event_found}`;
  })
  .catch(function(err) {
    console.log('error fetching distance: ', err);
  });
}

function getBike(e) {
  const token = window.localStorage.getItem('bikelock');
  if (!token) {
    alert("Missing token. Go log in at /login");
    return;
  }

  console.log('fetching bike');

  fetch('/api/bikes', {
    method: 'get',
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(function(resp) {
    if (resp.status !== 200) {
      return Promise.reject(new Error(resp.statusText));
    } else {
      return Promise.resolve(resp);
    }
  })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log("fetch bike success: ", data);
    userBike = data;
    const bikeInfo = document.getElementsByClassName("bike-info")[0];
    bikeInfo.textContent = `Bike: ${userBike.name}`;
  })
  .catch(function(err) {
    console.log("error getting bike: ", err);
  });
}

function getAllEvents() {
  const token = window.localStorage.getItem('bikelock');
  if (!token) {
    alert("Missing token. Go log in.");
    return;
  }

  if (!userBike) {
    alert("You have to fetch your bike first");
    return;
  }

  console.log("Fetching events");

  fetch(`api/maintenance_events/${userBike.id}`, {
    method: 'get',
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(function(resp) {
    if (resp.status !== 200) {
      return Promise.reject(resp.statusText);
    } else {
      return Promise.resolve(resp);
    }
  })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    const eventList = document.getElementsByClassName('event-list')[0];
    const eventTypes = document.getElementsByClassName('event-types')[0];
    const eventData = data
    eventList.textContent = JSON.stringify(eventData.events);
    eventTypes.textContent = JSON.stringify(eventData.types);
  })
  .catch(function(err) {
    console.log("Error getting events: ", err);
  });
}

const allEventsBtn = document.getElementsByClassName('get-all-events')[0];
allEventsBtn.addEventListener('click', getAllEvents);

const bikeBtn = document.getElementsByClassName('bike-btn')[0];
bikeBtn.addEventListener('click', getBike);

const submitBtn = document.getElementsByClassName('distance-btn')[0];
submitBtn.addEventListener('click', getDistance);

const createEventBtn = document.getElementsByClassName('eventPostBtn')[0];
createEventBtn.addEventListener('click', function(e) {
  eventType = document.getElementById('eventType').value;
  eventDate = document.getElementById('eventDate').value;
  eventNote = document.getElementById('note').value;

  createMaintEvent(eventType, eventDate, eventNote);
});

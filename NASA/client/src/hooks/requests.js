async function httpGetPlanets() {
  // Load planets and return as JSON.
  try {
    const res = await fetch(`/planets`);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  try {
    const res = await fetch(`/launches`);
    const data = await res.json();
    return data.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (err) {
    return [];
  }
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return response;
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    const response = await fetch(`/launches/${id}`, {
      method: "delete",
    });
    return response;
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

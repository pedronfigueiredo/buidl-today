const api = {
  async get(path) {
    let API_ROOT, FRONT_END_ORIGIN;
    const hostname = window && window.location && window.location.hostname;
    const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
    if (hostname === 'buidl.today') {
      API_ROOT = corsAnywhere + 'https://buidl-today.herokuapp.com';
      FRONT_END_ORIGIN = 'https://buidl.today';
    } else if (hostname === 'localhost') {
      API_ROOT = 'http://localhost:5000';
      FRONT_END_ORIGIN = 'http://localhost:3000';
    }
    let url = API_ROOT + '/api/' + path;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': FRONT_END_ORIGIN,
      },
      mode: 'cors',
    });
    if (response.status !== 200) throw Error(response);
    const body = await response.json();
    return body;
  },
  async post(path, data) {
    let API_ROOT, FRONT_END_ORIGIN;
    const hostname = window && window.location && window.location.hostname;
    if (hostname === 'buidl.today') {
      API_ROOT = 'https://buidl-today.herokuapp.com';
      FRONT_END_ORIGIN = 'https://buidl.today';
    } else if (hostname === 'localhost') {
      API_ROOT = 'http://localhost:5000';
      FRONT_END_ORIGIN = 'http://localhost:3000';
    }
    var strData = JSON.stringify(data);
    const response = await fetch(API_ROOT + '/api/' + path, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': FRONT_END_ORIGIN,
        'Content-Type': 'application/json',
      },
      body: strData,
    });
    const body = await response;
    if (response.status !== 200) {
      return ['error', response.status, response.statusText];
    }
    return body.json();
  },
};

export default api;

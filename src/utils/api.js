const api = {
  async get(path) {
    const response = await fetch('/api/' + path, {
      mode: 'no-cors',
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  },
  async post(path, data) {
    console.log('path, data', path, data);
    var strData = JSON.stringify(data);
    const response = await fetch('/api/' + path, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json, text/plain, */*',
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

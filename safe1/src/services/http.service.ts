class HttpService {
  get(url: string): Promise<Response> {
    return fetch(url);
  }

  post(url: string, payload: any): Promise<Response> {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }
};

export default new HttpService();
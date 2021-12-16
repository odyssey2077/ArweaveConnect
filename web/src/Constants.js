const prod = {
  url: {
    API_URL: 'https://metaworld-server.herokuapp.com'
  }
};

const dev = {
  url: {
    API_URL: ''
  }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;

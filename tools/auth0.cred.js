//this file consists of credentials for Auth0
import Auth0 from 'auth0-js';
export const auth0 = new Auth0({
      domain: 'telpro.auth0.com',
      clientID: 'xBBQ84BgP6Xp5qm93Zr7p17VzD5iP9l7',
      responseType: 'token'
});
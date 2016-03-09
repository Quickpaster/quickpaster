import { uuidToWriteable, uuidToUrlable } from './../../lib/uuidGen';

let g_clientId = {};

export function initClientId () {
  if (!Session.get('sessionId')) {
    Session.set('sessionId', Meteor.uuid());
  }

  if (!sessionStorage.getItem('sessionStorage')) {
    sessionStorage.setItem('sessionStorage', Meteor.uuid());
  }

  let browserId = localStorage.getItem('localStorage');
  if (!browserId) {
    browserId = Meteor.uuid();
    localStorage.setItem('localStorage', browserId);
  }

  if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', browserId);
  }

  let runId = uuidToUrlable(Meteor.uuid());

  g_clientId = {
    // Connection id. Initialized at runId at first time connection.
    connection: runId,

    // Meteor run. Survives disconnects. Changed after hot code reload.
    run: runId,
    
    // Meteor session. Survives hot code reloads. Changed in all other cases.
    session: Session.get('sessionId'),
    
    // Navigation session. Preserved between page updates (F5).
    // Changed on opening links in other tab.
    // Presents (pretty stable) opened window/tab.
    // Duplicated on 'tab dup'
    navigation: sessionStorage.getItem('sessionStorage'),

    // Cookie-like data. Preserved in isolated browser user context.
    // Should be interpreted as 'computer' to allow user's freedoms and choices.
    // No more deep identification should be allowed.
    browser: browserId,

    user: localStorage.getItem('userId')
  };

  return g_clientId;
}

export const getClientId = () => g_clientId;

export const logout = () => {
  localStorage.setItem('userId', Meteor.uuid());
};

// When 'Auth another browser' url is opened in another browser,
// displayed confirmation dialog 'Login here as <User ID>?'.
// When there was a previous logged user, 'Logout <User was> and login as <User ID>?'.
// Confirmation is necessary even when there were no previous sessions,
// to prevent fooling people when a malicious user shares its login identity
// and 'controls' victim's 'computer'.
export const auth = userId => {
  localStorage.setItem('userId', userId);
};

export function clientIdNotifyConnected () {
  let clientId = getClientId();
  if (clientId.run === clientId.connection) {
    return true;
  } else {
    g_clientId.connection = Meteor.uuid();
    return false;
  }
}


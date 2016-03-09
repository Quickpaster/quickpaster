import Tasks from './../tasks';
import { uuidToWriteable, uuidToUrlable } from './../lib/uuidGen';
import { initClientId, getClientId, clientIdNotifyConnected } from './lib/userId';

import start from './lib/engine';
import App from './app';


Meteor.startup(() => {

  window.addEventListener('beforeunload', e => console.log(`Before Unload: ${e}`));
  window.addEventListener('unload', e => console.log(`Unload: ${e}`));

  // Init client identification params on each start and even hot code reload.
  const clientId = initClientId();

  Tracker.autorun(function () {
    if (Meteor.status().connected) {
      if (clientIdNotifyConnected()) {
        console.log(`${new Date()} Connected.\nClient ID params:`, getClientId());
      } else {
        console.log('Reconnected.\nClient ID params:', getClientId());
      }
    } else {
      console.log('Warning: Connection Lost.');
    }
  });

  const handle = Meteor.subscribe('tasks', () => {
    bypass = false;
    console.log('State is loaded.');
    Meteor.call('notifyLoaded', `State ${Session.get('sessionId')} is loaded from`);// IP ${clientmultihomeIp}`);
  });

  let bypass = true;
  Tasks
    .find({}, {sort: {createdAt: -1}})
    .observe({
      changed: res => { if (!bypass) console.log('CHANGED:', res); },
      added: res => { if (!bypass) console.log('ADDED:', res); }
    });

  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  const title = document.createElement('title');
  title.text = 'Quickpaster MVP';
  document.head.appendChild(title);
  
  start(App, root);
});


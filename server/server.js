import Tasks from './../tasks';
import Users from './../users';

Meteor.onConnection(function(conn) {
  console.log(conn.httpHeaders['x-forwarded-for']);
});

Meteor.startup(() => {
  console.log('Server started');

  Meteor.publish('tasks', function () {
    this._session.socket.on('close', function() {
      // TCP timeout
      console.log('CLOSED:');
    });
    return Tasks.find();
  });

  Meteor.publish('users', function () {
    this._session.socket.on('close', function() {
      // TCP timeout
      console.log('CLOSED:');
    });
    return Users.find();
  });

  // query = {checked: {$ne: false}};

/*   console.log({
    tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
    incompleteCount: Tasks.find({checked: {$ne: true}}).count()
  }); */
});


Meteor.methods({
  notifyLoaded: function (text) {
    console.log(this.connection.httpHeaders['x-forwarded-for'].split(',')[0], text);
  }
});


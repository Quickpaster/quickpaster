import Tasks from './../tasks';
import Users from './../users';

import AppView from './../view/view';
import toHtml from 'snabbdom-to-html/lib';

Meteor.onConnection(function(conn) {
  console.log(conn.httpHeaders['x-forwarded-for']);
});

Meteor.startup(() => {
  console.log('Server started');


  WebApp.connectHandlers.use(function(req, res, next) {
    // next();
    // return;
    if (req.url === '/' || req.url === '/hello') {
      const homePageHtml = toHtml(AppView({state: {notify:[], address: req.url}, dispatch: () => true}));

      console.log('Requested', req.url);
      const oldWrite = res.write;

      const replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
      };

      const preloader = '<script>[ \
        ${scripts_list} \
      ].forEach(function(src) { \
        var script = document.createElement("script"); \
        script.src = src; \
        script.async = false; \
        document.head.appendChild(script); \
      });\n';

      res.write = function(chunk, encoding){
        // console.log(chunk);

        function extractScriptsUrls(body) {
          var re = /<script.*?src="(.*?)"/gm;
          var match;
          let scripts = '';
          while (match = re.exec(body)) {
            // full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
            scripts += '"' + match[1] + '",\n';
          }
          return scripts;
        }

        function extractAllJs(body) {
          var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
          var match;
          let script = '';
          while (match = re.exec(body)) {
            // full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
            script += match[1] + '\n';
          }
          return script;
        }

        const scripts = extractScriptsUrls(chunk);
        const script = extractAllJs(chunk) + '</script><title>Quickpaster MVP</title></head>';

        chunk = chunk.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        chunk = chunk.replace('</head>', preloader.replace('${scripts_list}', scripts) + script);
        chunk = replaceAll.call(chunk, '<body>', '<body>' + homePageHtml);

        return oldWrite.call(this, chunk, encoding);
      };
    }
    next();
  });

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


To write a web application I dreaming a year about it is necessary to consider very simple design principles.
Maybe, application itself should be very simple. But even simplest applications threat to be modular.

Because of lack of npm-like require in browser, one needs to use JS compilers.
You couldn't write `require()` in your code which will be loaded directly by the browser.
You have to wrap it by special code fragments, at least. This princilple moves us to recompiling development workflow.
Which is most robust when you just type `recompile`. Because your server code changes too. Your database too.
It is convenient to start compilation (and even database migration) within your server's startup code.

For creating MVP, one should:
Write code ASAP (but have it agile enough). So I love to use React.
User's data is most important thing. So we'll have it consistent and backed-up.

* Simplicity
* Velocity
* Data durability

- No distributed load balancing. Because servers mostly work.
- Compilers are required because of npm. For structuring code and using complex dependencies.
  But use them with simplicity and always-enabled source maps. Don't minify.
  So, JSX, Babel, ES6 are nice shot.
- No geopositioning (servers placement). It is enough to have a server in Frankfurt.
  Because most people use phones and wireless latency is much more than distance from Sidney to New York.
- No supercool technologies like delta-CRDTs because it takes a bunch of time to learn them all.
- No one-size-fits-all solution. You could use Python, bash, PHP, Node.js, C and C++ there where appropriate.
  Fear that it could be not sufficient memory is not justified.
- No complex update process. Just show static page 'we're updating' and that's all!
- Using nginx allows do that with ease.
- PostgreSQL is the one DB.
- You need **backups** and not load balancing or hot slaves. Backups are definitely NOT slaves.
  Imagine replicated 'DROP DATABASE'.
- The only reason to have backups - cloud provider dependance. So, store backups in another datacenter.
  Imagine how you'll start it from scratch after one provider's failure. But it is acceptable to have a blackout in the case
  of emergency.
- To not loose the users, keep log of user ids (and emails) of those who are modified DB or just registered since last backup
  on another server.
- Or just set up master-slave replication for that purpose. Make backups on that slave when doing DB migrations
  and for a case of be hacked.
- Only _local_ development. But with tests. You need behavior tests and regression tests.
- To speed-up development you could use local server with always-reloaded routes like in PHP.
  Session data will be in the router, but not in controllers/models etc.
- The same about WebSockets. They are session-data related objects. Just store data with them.
  On _each_ message one could create new controller re-compiling a file.
- Avoid worker processes.

* Written above needs more **simplification**

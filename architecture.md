# Terminology

Terminology should be re-written according to most concise one got from Event Sourcing
approach:

## Parent/Child vs Owner/Ownee
Owner, Container, Aggregate are great words and exactly describe the same thing.
But for their attributes, fields, values, members and even elements - all that semantics
are just too foolish to confuse the thinkers.

It is greatly worth noting that term 'Value' exactly describes all the sum of a Container's
parts. So, term 'Internal State' completely equals to term 'Value'. But there's no precise
word to describe a Container's Element by omitting the word 'Container'. Because even Container
may be an attribute of its containing Container. And word 'Element' describes a Container both
as an owner and as an ownee. But the word 'attribute' is hard-linked to its container, not
describes the entity itself. An attribute can be both a container and a final type.

Final types are described just by Enumerations of all their Values. So, when we talk about
a type, we mean a range of Values. State is internal contents of the State Container.
Thus, State Containers may be of two types: Container of Container(s) and Container of Value.

But the word 'Value' is too wide to describe 'Final Value' term. We have to use another term
for it. People often use the word 'Atom' confusing readers more. It is worth noting that 'Value'
and 'Instance' and 'Contents' are the same words.



## Event
In our model we name it Action.
A notification from executed operation, an action on a state machine, a command send to state machine.
Very often people name events as actions.
Actually, when Events come from outer world, they could represent _facts_ about external world
changes, when they're requested in Actions (Effect requests).

To a parent, it's child state change _always_ is an Event (a fact that another world is changed).
Thus, parent's Plugin may implement a Model State change observer, which will look at the child's
Model State and emit an automatical Event when child will have a corresponding state.

Event is named instead of Actions in Redux not to confuse people. And we exactly mean those 'click' UI events too.

## State
A returned value of special state function call wich returns one of the values of the enumerated State type.
Sometimes people name that as 'control state'. Also they often name 'Model' intermixing both Model Type and Model State.
In our documentation we also often mix 'State' and 'Model State'.

## Execute
A concept which have to be consisted of two parts instead of ES single concept 'Execute'.
First part is (Model State + Action + action data + Model Event Dispatchers) 'presentation' reducement
(which we name 'Plugin') which leads to a special Data Arguments adapted to pass them into corresponding 'driver'.

Sometimes, after a child effect's execution, the resulting data have to be passed as arguments into the following
parent's driver instructions, a driver implementation should support parent/child component relations too.

So, a Plugin should be able to create a reduced effect data representation which will be possible
for parent's driver to understand after which parent's instruction it should execute
child's instructions, and which arguments from the parent's instruction execution results
the driver should use in child execution context, and how to use the child execution results
into the parent's subsequent instructions execution.

A plugin should provide driver with such information. Maybe, support of runtime variables bindings
and usage of child driver execution results as a variable in parent's execution context.

Please carefully note that plugins never 

A complex function performing an Effect (Action!) based on given state which could lead to one or more events.
In our model it is divided into the system of Plugins (which determine partial Model State Representations
based on Actions and bind area of allowed Events into a Model State Representation) and Drivers
(unpure functions), which receive Model State Representations bound with Event Callbacks and Execute given Representations. 
Often named as Async Action Handlers.

## Action
In our model we name it Effect. Information from State Transitioner about changes it request from outer world.
Often people name it 'Intentions' to change 'state', but mean the state of outer world.

We can use Yassine Yelouafi's concept named 'Effect' instead of action because it describes intent.
Or rename it just to Request.

## Apply
A pure state transition function. Supplied with Model State and Event and leads to a new Model State.
Often we call it 'update()', 'init()' or State Transitioner. Event Soursing not describes Actions (our Effects)
as another output from the Apply function, but just accounts them as a part of the Model State ('Action Requests'???)
Apply function receives an Event from outer world (a fact that some previous thrown Action (Effect!) led to world change,
and have to reconcile that Event into a new internal State / Model State _and_ new Action requests (Intentions to change outer world).
Events should not be interpreted as Intentions too, because they are REALLY FACTS
described REAL CHANGES, objective truths which happen externally. That Events lead to UNCONDITIONAL internal state
transition, they can't be thrown away. So, if some Event can't be processed by internal state machine, that's not
inadequate 'intention request from the outer world', that's a FACT, and error is inside our state machine that it couldn't
interpret the Fact. And intentions are our model's Effects (which named just Actions in the Event Sourcing approach).
Also, that's great to call Events as Notifications instead of Actions or Facts, because a particular state machine
just could ignore some facts which were sent to it.
Also, in Redux, this 'Apply' is named 'Reduce'


# Research

State contains actions, available to process in that state.
When state changed to that one which doesn't support particular action,
the state should clear that action available for execution within
view rendering or effect execution.

When an effect is executed, the list of allowed actions on the state
is passed into the effect handler and _fixed_. The same is true when
a view is rendered.

If other action tries to change the state in such way that the list of
allowed actions changed and that effect which is currently yet executed
emits the deprecated action, assertion will happen. The same is true for view.

So, when one action is going to convert state to another state in which
some of the currently allowed actions will change, state have to emit
new effect which will cancel pending operation in the effect
in such way that it can't emit no more deprecated actions.

Every component's Action Mapper (component's update() function)
should select appropriate Action Handler based on the current state.
Then Action Mapper passes the action and state into corresponding Action Handler.
The Action Handler then calls corresponding handler.

It should be easy to migrate between allowed actions sets.
One way is to specify list of possible states explicitly and list of allowed actions
for every state. State in that context is just label.

Application could have Initialize effect which allows to emit corresponding
initializing action which fills the initial state with corresponding values.

Without the initialize effect, state will be 'Initial' and couldn't be initialized
by passing special values into the init() function.

Other way is to call init() then call update() and pass corresponding action
into child component. The action will contain all the necessary state initialization
values. Parent component may call the update() function more than one time,
but have to collect all subsequent effects which will be emitted from child
component's update().

init() should return initial 'raw' state and 'Initialize' effect.
The Initialize effect and initial state will be passed into app's
top-level execute() with dispatcher's callback.

After the execute() executes the Initialize effect (and probably
extracts corresponding user's data from database), it will emit
Initialized action which will contain all the extracted data.

After that, SSR passes the Initialized action into top-level update()
and passes result of the call into SSR view.

The rendered view html just passed down to browser, but the effects
returned from the top-level update() function can be used
to track server-side subscription part of the application.

An effect thrown from top-most update() can't be filtered.
It just enum plus a function reference with all necessary bound
arguments and even dispatcher. But then it is unclear how to pass actions
to parents from child components by other means than from views.

Also, parent component views can pass to their children more than one dispatcher
reference to support application-level view-independent actions.

A view() could dispatch a synchronous action at time of view() function call.
Both can be true for execute() call.

It sounds like straightforward way to pass actions to parents. Just calling parent's passed
dispatcher() function references synchronously right at time of child's execute() call.

But it is just a behavior derived from current child state after its update() processing.
And that behavior purpose is not for asynchronously or synchronously change world's state,
but for calling corresponding dispatch() function - even to pass back the new action to itself.

It is not like view() async handlers, although view() render could do that (emit new action not from
say, an on-click handler, but directly within view() body call. That means that child view() can call
parent's dispatcher right at child view() invocation point, synchronously.

Such actions will move to infinite recursion calls. Therefore, it is deprecated not only for views,
but for execute() calls also. An execute() call handler never should emit synchronous action.

The same is true for views. The only way to emit 'synchronous'-like action is to use setTimeout()
(because setImmediate() is unavailable in browsers) or from requestAnimationFrame().

So, parent's dispatcher function thunk should check that child's emittable action is not passed
into dispatch() while child's execute() or view() call is in progress.

It could be two types of dispatch() function references passed into view() and execute().
First - is parent's handler, which may identify the child component when the child's action happen
but not necessary to do that. The action is supposed to pass to parent or be easily filterable
by parent.
Second - is internal child's handler passed transparently thru the all parents handlers chain.
It contains bound child information and need no necessarity to identificate the child component
within parent's update() function.

So, emitted actions may be divided into parent notify actions and pass-thru actions,
which are supposed to bubbling up in view() and execute()
and trickling in update() down to child's update().
The only purpose of that pass-thru trickle down is to identify
child component by means of parent's state and action contents.

But view(), when it receives full parent state, uses the same filtering scheme to determine
every their children' state. The same filter could be used in the pass-thru dispatcher automagically.

When view() is processed hierarchically from up to down, state is filtered to determine children's
state, AND parent view creates dispatcher callback for each that child view.

In the view it may be the limited part of children (real state could contain more elements
but the view filters them out based on some criteria).

So, we need to attach not filter to dispatch(), but child component SELECTOR.

In case of not list of child components, but different entity types of them, a SELECTOR
is always used in the view() function. The same selector code could (and should) be shared
with update() code.

But there are very good news: when child components may be filtered, it is ALREADY NECESSARY
to have a handler wich will determine child's id relative to parent
and NECESSARY wrap that action into the parent's one. Parent will receive NOT GENERIC pass-thru
actions in such cases, but specialized container-related actions.

It sounds good to use child type mapping in SELECTOR. But it nails down the mapping
between view(), update() and execute(), forcing hard component model instead
of agile which could work with, for example, with a lot of view components
emitting actions around the same state and having only one update() 'component'.

This functional approach doesn't force a developer to use OOP or Prototypes.
Using SELECTORS will force.

Using model functions sounds great approach. So, parent's model function 'selectChild' will
filter out the corresponding part of state, disregarding its handlers. The model function could
be prototyped in the body of state, that's appropriate. But handlers selection should be part
of parent's update(), view() and execute() logic. What model filters out is only 'child' state,
in quotes because it's just _part_ of parent's state.

Therefore, passing of 'internal' actions related only to child component may be implemented
by dispatchering into parent's dispatcher which will bind the selecting model function
(without state, of course) to parent's pass-thru action emitter.

Thus, selection of partial state related to a child is not strongly typed but completely
encapsulated inside the parent's logic. Parent can use either appropriate method.

The pass-thru actions are not highly transparent. They really require parent to make manual
filtering to keep the model agile. Therefore, they could be named like 'SendToChildName'
of 'ActionForChildName'. Child's type is encoded by parent's action signature itself,
because it allows to completely separate update() and view() hierarchies.

# TLA+ Next Action Predicate

As we see from the description, we couldn't have automatical actions after model state changes
not in view() nor execute() because it follows to potentially infinite recursion.

So, imagine a component without view which wants to emit automatical actions (based on new state) to its parent.

Passing an Effect to execute() sounds heavy-weight and unnecessary complication - and it forces
implementation to use setTimeout()!

So, we need a dispatchable way to derive a new action (or more!) from new state which will work like
view() and execute() but automatically based on action mapper results.

Next action predicate support is completely equivalent to Effects execute() support.

Code logic is the same. So it is a big question whether or not to separate it to nap(), async() and dirty().

Effect name, effect arguments and complete current state are passed into present() function,
which will filter out the necessary data to create a stale data and state representation useful
for passing into corresponding effect execution function. For a single effect,
application can be configured to have multiple present() functions, which will
adapt state and effect arguments into arguments for a particular presentation function.
Application can be configured to use different multiple presenters even for
the same present() effect arguments and state convertation.

Component's init() function have to be supplied with external pluggable Effects mapping,
for every component's effect it should be at least one (assigned by list) presenter,
which will implement action predicate interface. For each effect, it could be a list
of state adapt functions, for each state adapt function, it could be a list of presenters
supplied externally. All presenters, even console.log(), have to be supplied externally as dependencies.

Presenters code is universal and may be useful to visualize/present/subscribe
and make other effects on multiple different kinds of applications.

But presenter adapter is a plugin interface for a component.
It could be supplied externally, but have to know state's internal structure.
So state present adapters may be named just plugins.

A presenter can output information to external world and can pass it down into component.
Time measure is also kind of such information. When a component emits effect asking time measure,
external world will measure it with setTimeout() call!

To make a presenter work, it should be attached to a corresponding component plugin.
Effects are pretty abstract notions of world changes.
But plugins contain precise interface describing exact part of state and effect arguments available
for a presenter and precisely specify which actions a presenter can use to change component state.

(action, actionArguments, state) => update => (state, [effect, effectArgument]) => plugins => presenters

That's the final architecture.

But follows with more deep Plugins idea research (and implementation, see `client/tlap.js` draft)...

```
'Allowed Effects List' -> init
statemapper:
f(state) => _S_

effect: [possible actions]
effect: [args]

available [effects]
state
action
[action data]
  
  goes to ->

   new state +
   [[effect, args]]

one effect
  -> multiple effect mappings ('plugins')
     -> multiple renderers

(effect mapper 'plugin')
* state (+ model prototype funtions for easy manipulations with state)
* effect [effect args]
* [available actions] - below we considered that it's better to have
  access to all list of state transitioner actions, but access them
  via complete(), abort(), error() and usual dispatch() system 'require()'-like
  interfaces to track actions use and make dynamical automatical check
  of all state transitions.

  => results in
    reduced stale state ('view data')
    reduced actions callbacks (usually embedded into the view data
    to described earlier 'complete()' and other functions.


* * * effects (callable to create and 'throw' from init() and update()
<--- <--- <---
[Child.Effect.bind(child plugins)
Child.init(mappers)
effect.call(state, actions) - legacy schema
```

It is worth noting that the technology can even use jQuery for rendering instead
of Snabbdom and React approaches. Changesets describing what are exactly changed
may become part of the new state, thus allowing to describe diffs between states.
That 'changeset' part may even be incremental, allowing to navigate historically
between all the state changes.


(action, actionArguments, state) => <engine passes allowable effects list here> update => (state, [effect, effectArgument]) => plugins => presenters

A plugin should have access to any future possible (not only allowed!) action on any future state of the object,
not only on its current state.

That means that plugin have access to component's global action list.
Also, it should be a model function which creates a 'list' (named map) of actions possible on the given state,
that is the only way to get all possible component's actions - both private and public.

Component filters out this list when returns from its init() or update() function
thus creating a public interface for its parent/owner. Its private interface is passed into
the system init()/update() proxy thus containing all possible actions.

Any action returned from component's init()/update() to the proxy may have been passed before
by the component into one of its allowed actions for any thrown effect.

A component can't But it could be more than that, a component may give access to its future state possible action
into effect's allowed actions list.

While an effect is not canceled, it means that at any given time it could happen an action on state (on any state!)
which was passed in the list of effect's allowed actions, effectively creating a chain of state transitions
and allowed actions.

The thrown effect can be supplied with ANY action from that State Transitions Chain/Loop.
Component should guarantee that every that action will be available in any state from the chain
before cancelling or completing the effect. Cancelling and completing should be created with
allowed actions 'Canceled' and any kind of some 'completed' action wich will mean that effect
woun't more calls any provided action, i.e., it effectively 'destroyed'.

To make cancelation support, a component should be provided with both 'start' and 'cancel' effects.

#### Uncancellable Effects
Some effects may be uncancellable, i.e. a component can't control
that effect woun't emit any action which were supplied to it.
Such component never can't transition to its state which doesn't allow
receiving one of the provided actions into the effect - while component has its state.

#### Effect's Supplied Actions
Thus, a component may supply any its effect with any private or public action,
sometimes effectively extending its transition chain area. The system may detect
that automatically and throw logic exceptions when a component transitions
to a state without canceling the effect supplied with a prohibited action.

To make that magic happen, the system should know when an effect is finished
(complete, failed, canceled).

The effective state transitions chain area is dynamic, not static, it can't
be determined just by statically analyzing all possible thrown effects
and allowed actions passed to them.

The magic can work when marking some actions for an effect as action which moves
to effect's finish. So, any effect can be supplied with any type of the following
actions lists:
- Allowed Complete Actions List
- Allowed Failed Actions List
- Allowed Aborted Actions List
- Allowed In-Run Actions List

But the system is not interested in the semantics. It should be just two lists
of allowed actions:
- Thrown When Complete (if calling without exiting will throw driver exception).
- Usual Actions (never indicate effect's completion/error/cancellation;
  if an effect exits before emiting its 'Thrown When Complete' action, the system throws an exception too!)

To abort an effect, it should be used an another effect

Effect specification is supplied with full two lists of allowed actions - the first
designates effect's completed 'state' and the second is just used while the effect works.

But that full specification is component's own 'semi-public' ('protected'???)
interface allowed to use in Plugin state reduce implementation.

Plugin state reducer implementation can use all list of the allowed actions for an effect.
But the system have to track which precisely actions the Plugin state reducer
uses to pass callbacks to the driver.
Therefore, plugin will be supplied with callbacks to action creator factories:
  
  - a Plugin calls an action creator factory, the factory returns action creator
    which plugin can use to call directly to create an action or to pass
    the creator down to driver.

List of actions allowed to emit from an effect should be static.

A plugin is supplied with action creator instead of dispatcher because amount of actions
is fixed, but amount of effects multiplied to amount of actions could dramatically
increase consumed memory and performance. It should be a simple dispatcher
which could switch internally on type of action emitted to mark plugin instance's
destruction.

Plugin instance is bridge from driver up to component thru dispatcher.
It converts driver's low-level events into actions.

So, plugin may be supplied with complete list of allowed actions,
but plugin 'requires' only that of them which it will call.

It is preferrable to implement that as explicit 'import' of the every named
action to make the system determine which actions the plugin could actually use.

This 'import' should be happen on the plugin's initialization phase, when it will
bind all required actions into explicit parts of it.

Plugin instance, when called, creates just arguments list for one or more drivers
attached to it. Attachment of the drivers is completely external to application.

All drivers should be attached to corresponding plugins on the start of the app.

Parent's operation plugin code should know how to filter the full state
and determine child state. Based on that child state it could call child's
operations sequence which is supplied by child effects list thrown in its
update() or init() functions.

Child effect information either collected in parent's effect instance,
or passed into plugins chain like in views implementations.

Child component's operations chain will receive filtered state,
specialized effect info for child (its own effects list),
event back dispatch callbacks (which will convert low-level actions emitted
by child components into high-level parent actions.

All that code will happen in plugins code.

A plugin is like a view() function. And a driver is like an execute() funtion.

When a view subsequently 'rendered' from a general 'plugin' function, parent's view,
it will pass information to child plugins based on children effects list packed
into parent's effect description. Thus, a parent's plugin function
should be able to filter out child's state (and determining allowable
child actions based on the state) and passing that state into a child plugin.

Plugins call chain thus creates only actions callback thunks and passes effects
arguments down to farther children.

Plugins should return complete set of _arguments_ for their respective drivers.
The returning happens, of course, from children's plugins to parent plugin.

When parent plugin receives children's answers (their plugins return values),
it should pack the answers into respective identifying arguments of upper resultset.
One example of the resultset is VDOM with bound action callbacks. When a child returns
the VDOM fragment, parent just capsulates it inside it's own returned resultset.

Uppermost parent plugin should encapsulate all collected callbacks and driver arguments
and pass the data to attached drivers. Result of all plugin chain execution will be supplied
to all attached drivers. One upper plugin may be connected to more than one driver.

Internal plugins can't be connected to drivers directly, that's the task of the
main application. Upper application's plugin(s) should be callable by the engine system
and their results will be passed into driver functions.

On the upper level, application can be configured to have attached more than one driver
function to one plugin and the engine will pass the plugin's processing result
into all attached drivers functions. It should be allowed to have different number of
arguments between different drivers of the same plugin, but they should be completely
compatible by arguments order or key maps.


When child component is initialized / updated, it should be supplied with
'binder' functions, which will map to...

Plugins has access to _all_ component actions, but should mark them belonging
to one of the 4 particular action groups, 'complete', 'fail', 'abort' or usual ('progress')
and serialize access to all used actions thru special system access 'require()'-like
function calls. For an example,
 
```
// Action creator example:
complete(Child.Action.Walk)(actionArgs);
progress(Child.Action.Sit)(actionArgs);
```

This calls are dynamic, i.e. may be happen even after passing resulting state presentation
to drivers. But the system may wrap this functions around concept of Action-Effect Group ID
(see below) to differentiate and group completed actions from multiple sources.

A component is a state presentation. One state may be shared between multiple components.

A state should be shared either by means of drivers isolation - automatically
in the configuration system thanks for different plugin hierarchies.
Another way to share state - explicit share in plugins body code between different
passed down plugin types and handling each answer (plugin's return value) explicitly.

That means that multiplied plugins will receive the same effect,
but may be supplied with different action dispatchers provided by the parent plugin.


Action Source: 'Driver.PluginPack'.
Plugin Packs may be described by 'Parent Pack'.'Child sub revision' with unlimited
chain depth, but only when the same parent pack uses the different child subpacks.
Otherwise child packs are always assumed the same as parent's when resolving
which child plugin functions plugin implementations may be imported and called
inside of parent's plugin implementation passing part of filtered state to them.


It may be sub-completion events, notifying state with sub-plugin completion.
They work like 'Progress' actions, not finishing the effect.
But when the last completion action is emitted by the last sub-plugin,
state transitioner receives 'Full' completion action. State transitioner
should receive all sub-components completion actions just as a special kind of actions.
But different plugins may complete with different kinds of actions!!!

Completed, aborted and error just have to be the same action, 'Complete'
with aggregated sub-actions of all components. Any plugin emitting 'Complete' action
can supply it with a complete result, 'succeeded, failed or aborted'.

It may be partial failure, it should move to general failure. It may be partial abort,
it should move to general abort (but only when all complete actions has been collected).

Succeeded should be filled with complete list of success results from each plugin
(with one or more different kinds R1, R2, etc.)


'Completed' action contains all result types in order of their happening.

'Aborted' action may contain all types of results: completed (with types),
failed and aborted. The list have to be in order of happening.

'Failed' action may only contain failed and completed result types, never aborted.

Thus, it should be 4 types of actions available for plugins 'require()'-analog
action importers, not 2.

'Half-Completion Notify' actions supply all the events in time, one-by-one.
Their type is like 'Progress', but they should contain attached Action-Effect Group ID
(see below) to precisely identify completed plugin place.

Completed, Aborted, Failed are common _kinds_ of actions, not instances, and may contain
exact action instances inside of them. 'Half-Completion Notify' too.

5 kinds of actions:
1. Concurrent actions ('Progress'), intermixed from different drivers and plugin instances.
   Anonymous source by design.
2. Completed (with a list of sources and exact completion actions)
3. Failed (with 2 lists of failed and maybe completed actions, no abort there)
4. Aborted (with 3 lists of action kinds)
5. Partial Completion (only one action of kind 2, 3 or 4).

Each state tranitioner should support receiving of 4 special system kinds of actions,
Completed, Failed, Aborted and 'Partial Completion Notify'.

So, 'Effect Group' concept is emerged. A group of effects unites Actions
(R1,R2,Er1,Er2,Ab1,Ab2) and Effects (Ef1,Ef2) into one logical entity.


State transitioner should process Action-Effect Groups:

- EG1Completed
  - CompletedAs1Action[src id] -> transitions...
  - CompletedAs2Action[src id] -> transitions...

- EG2Completed
  - Result3Action -> transitions...

- EG1Failed
  - Result1Action -> transitions...
  - ErrorResult2Action -> transitions...

- EG1Aborted
  - Result1Action -> transitions...
  - ErrorResult2Action -> transitions...
  - Aborted1Action -> transitions...

- EG1Notify
  - Result1Action -> NO transitions (only notify reactions)...
  - ErrorResult2Action -> NO transitions...

When an effect is thrown, state transitioner have to specify Effect Group name for every effect.

The same effect may belong to different Effect Groups; The same is true for Actions.

A state transitioner passes Action-Effect Group ID which it can differentiate in Actions case() part.

The system groups all kinds of 'completed', 'failed', 'aborted' and 'partial complete'
actions emitted from plugins respectively to that Action-Effect Group ID. The system intentionally
doesn't group any progress actions by that AEGID emitted by plugins and not allows to identify
particular plugin source (that actions are anonymous.


Plugin Packs Group - configuration part, builds plugin chain hierarchies allowing
parent plugins implementations do 'require()' their corresponding child plugins
implementations. Grouping is allowed across multiple effects.

The plugin group information is not used inside init and update implementations.

It's static and external to the core app.


# New Ideas

State Transitioners are not have to work with real state at all!
They could be supplied with State() function call result wich just supplies
them with 'State ID'. And when their state machine transitioners should emit
new effect requests based on received Event ID, Event Arguments and State ID,
they just transition the state machine to a new State ID (without modifying
even their Model State's fields/attributes at all!) and throw
a new Effect Request ID + Effect Request Arguments along with the new State ID.

It is worth noting that a State Transitioner may throw an internal Effect Request
containing in its arguments all the internal state or, better, state deltas!

To derive the Effect Arguments containing state deltas, a State Transitioner may
base thrown Effect arguments on received Event arguments.

A component even may throw its state just from its respective State Storage Plugin,
thus effectively outsourcing its internal state semantics into an Effect Request Reducer.




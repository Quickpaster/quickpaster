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

Effect name, effect arguments and complete current state are passed into present() function, which will filter out the necessary data to create a stale data and state representation useful for passing into corresponding effect execution function. For a single effect, application can be configured to have multiple present() functions, which will adapt state and effect arguments into arguments for a particular presentation function. Application can be configured to use different multiple presenters even for the same present() effect arguments and state convertation.

Component's init() function have to be supplied with external pluggable Effects mapping, for every component's effect it should be at least one (assigned by list) presenter, which will implement action predicate interface. For each effect, it could be a list of state adapt functions, for each state adapt function, it could be a list of presenters supplied externally. All presenters, even console.log(), have to be supplied externally as dependencies.

Presenters code is universal and may be useful to visualize/present/subscribe and make other effects on multiple different kinds of applications.

But presenter adapter is a plugin interface for a component. It could be supplied externally, but have to know state's internal structure. So state present adapters may be named just plugins.

A presenter can output information to external world and can pass it down into component. Time measure is also kind of such information. When a component emits effect asking time measure, external world will measure it with setTimeout() call!

To make a presenter work, it should be attached to a corresponding component plugin. Effects are pretty abstract notions of world changes. But plugins contain precise interface describing exact part of state and effect arguments available for a presenter and precisely specify which actions a presenter can use to change component state.

(action, actionArguments, state) => update => (state, [effect, effectArgument]) => plugins => presenters

That's the final architecture.


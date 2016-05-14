#include <stdio.h>
#include <sys/file.h>

int sum (int a, int b) {
  // Our summator receives queries for summing
  // from everywhere. The queries can be stacked
  // in a queue. The summator will handle all of them when
  // it will be ready for that task.
  // It also receives return addresses
  // and information about receivers.
  // Time of any request has a sense too,
  // So, for every function call we always have
  // - request time
  // - caller instance unique ID (we can filter them and access control),
  //   for example, main called us from the state #1 with given incoming
  //   arguments 'args' and 'argsCount'. State has its history as well.
  //   When a component is cloned ('fork'?), the state is branched -
  //   both of them have the common history.
  //   When state is changed, its version number is incremented.
  // - caller type unique ID ('main' function within particular program)


  // Places combined data into requested place. Usually it should mean
  // 'emit message that summator is changed. It now has new state
  // which has a new result for requestor function.
  // Also it can emit state change into the feature space,
  // that 'sum of 1 and 2 equals 3'. All the components who
  // need that sum can use the answer immediately.
  // Other components wich will ask the question later will be
  // automatically provided with the same answer, if our component
  // is marked 'pure functional' and 'stateless'.
  // From the other side, it can be made automatically.
  // The receivers just may be imlemented in such way
  // that they filter all the messages with the matching pattern
  // 'sum of 1 and 2' and query filter 'place the result here'.
  // So, when the pattern will suffice, activation will happen
  // automatically.
  // We can create an idea of 'completeness'. In such way that
  // 'result' may be empty and activation woun't happen
  // before the summator places result.
  // For not pure functions it will be useful to wait on
  // more complex pattern: 'request from main for sum of 1 and 2
  // called 2016-05-08 11:03 PM from state #1 <waiting result>'.
  // In such way, the summator have to publish results
  // of any requests providing with identification data.
  // Remember that the summator itself usually filters only for
  // 'sum' signature and 'a' and 'b'. But in some complex cases
  // it can allow to do sum only to specific functions being in a specific state.
  return a + b;
}


result_type function_name (arg_type_n arg_value_n) {
  result_type internal_variable = external_function(arg_value_n);

  return return_value;
}

function_label:
    mov esp++, next_instruction
    mov eip, external_function
  next_instruction:
    mov eip, esp--

external_function:
  mov eip, esp--

#1: function_label
#2: next_instruction

Also function has its 'factory-like' activation name. Before the activation,
function has no internal state at all (usually, without 'static' variables).
After call happens, the function is activated - created its instance.
The instance contains the passed arguments and expected return point.
The return point is not just a labeled next instruction pointer of the
calling function, it belongs to the calling function instance.
After function passes its result values, those values become new function's
instance state.



Pattern Selectors:
#1: function_name (arg_type_n) - before function call -> state becomes
                                 'passed arg_value_n to external_function, waiting result'
#2: 
                                 'function external_function puts its result for our call into its output state'


// System called here already
int main (int args_count, char** args) {

  // Our pattern matcher was 'main'
  // it gets args and argsCount
  // Nobody knows that we changed here.
  // Our pattern matcher was activated
  // and we change ourselves with that fact.
  // We need to notify all the world about what actually changed.
  // We can identify us as unique instance ID as long with
  // our ideal type ID.
  
  // #1
  int a = sum(1, 2);
  // Placed request 'main' wants 'sum' of '1' and '2'
  // in its 'a'. In the synchronous case, we publish our pattern
  // matcher to the system which contains only 'sum of 1 and 2'

  // #2
  int b = sum(3, 4);
  // 'main' wants 'sum' of '3' and '4' in its 'b'

  // We can execute both queries in parallel as long as we need
  // no results to operate upon. Even if we use results,
  // they may be lazily shared to form following requests.
  // Such requests are some kind of 'Input Promises'
  // wich go to the sum queue when they are ready.
  // The promises are one-time function execution analogs.
  // Our function waits publishing of 'sum' results
  // for specific version history of us.
  // Both #1 and #2 are OK. The histories itself are
  // our current pattern matchers. If summator throws the
  // versions, we'll use them in parallel.
  // Our pattern matcher waits any of them.
  // We can cancel the requests before time passed,
  // and we no more being waiting for that patterns.
  // We'll publish to system our new pattern matchers
  // which are not contain the specific result waiters.
  int c = sum(a, b);

  // We put 'printf' as our output part as long with
  // 'args'
  printf("%s\n", args[0]);

  FILE* f = fopen("b.txt", "a+");
  fwrite("Hello\n", 1, 8, f);

  // Address to put into the system
  return 0;
}


// Plugins configuration:

import Type from 'union-type';

const Child = {
  init: () => [{}],

  Effect: Type({
    A: [],
    B: []
  }),

  standardEffectPlugins: {
    A: {
      simple: () => (console.log('simple'), true),
      complex: () => true
    },

    B: {
      makeThat: () => true,
      doIt: () => true
    }
  },
};

const externalChildPluginsPack1 = {
  B: {
    makeThisNow: () => true,
    superPlugin: () => true
  }
};

const externalChildPluginsPack2 = {
  A: {
    makeSuperHere: () => true,
  }
};


const Main = (() => {
  const init = () => {

    // Configure our child with customly provided plugins
    // multiple plugins are allowed for a single effect.
    // Plugins should be installed and available for use with Child.
    // User can choose only from list allowed for Child.
    Child.init();
  };

  const Effect = Type({
    Walk: [],
    Run: []
  });

  // Standard (internal) Effect Plugin Packs:
  // When this component will be extended with other plugin packs,
  // this field will be extended with their respective key names.
  const op = {

    // Every Plugins Pack maps each Effect to list of named available operations
    // Plugin pack named 'std' can (and should!) be provided only within component as its part.
    std: {
      Walk: {
        simple: () => (console.log('Walks simple'), true),
        complex: () => (console.log('Walks complex'), true)
      },

      Run: {
        makeThat: () => true,
        doIt: () => (console.log('Run.std.doIt'), true)
      }
    }
  };

  // Base component defaults
  const script = {
    Walk: op => [op.std.simple],

    Run: op => [
      op.std.doIt,
      op.std.makeThat
    ],
  };

  return {init: init, Effect: Effect, op: op, script: script};
})();


const externalMainPluginsPack1 = (() => {
  const plugin = {
    Run: {
      makeThisNow: () => console.log('Run.pack1.makeThisNow'), true,
      superPlugin: () => console.log('Run.Pack1.Super plugin'), true
    }
  };

  // Enables corresponding standard plugins,
  // adds own default-enabled plugins.
  //   op - plugin packs with base component's plugin field named 'std' and other,
  //        and this plugin's named field, direct effect key reference
  //   script - default base plugins list for given effect
  const script = {

    // Example: add Main.complex operation to Walk effect script.
    // Note: we not add our plugins by default.
    Walk: (op, script) => [
      ...script,
      op.std.complex],

    // Example: completely override base component effect's plugins order
    Run: op => [
      op.std.doIt,
      op.pack1.superPlugin
    ],
  };

  return {name: 'pack1', plugin: plugin, script: script};
})();

const externalMainPluginsPack2 = (() => {
  const plugin = {
    Walk: {
      makeSuperHere: () => true,
    }
  };

  // Doesn't override base defaults, they're enabled
  // by base defaults (only a user can add this plugin's capabilites).
  return {name: 'pack2', plugin: plugin, script: {}};
})();

// Get all plugins for current effect, Object,
// key - plugin pack name,
// value - available script operations for the effect.
const makeEffectPacks = (effectName, packs) => {
  // Build merged packs
  const opPacks = Object.keys(packs).reduce((effectPacks, packName) =>
    ({...effectPacks,
      [packName]: {
        ...packs[packName][effectName],
        script: packs[packName][effectName] ? packs[packName][effectName].script : null
      }
    }),
    {}
  );

  // Allow complex references in default scripts:
  return Object.keys(opPacks).reduce((effectPacks, packName) =>
    ({...effectPacks,
      [packName]: {
        ...opPacks[packName],
        script: opPacks[packName].script ? opPacks[packName].script(opPacks) : []
      }
    }),
    {}
  );
};

const extendComponentWithExternalPluginPacks = (component, ...pluginPacks) => {
  const basicScripts = component.script;

  // component.script - Object, where
  //   key: Effect Name,
  //   value: function (pluginPacks), where
  //     pluginPacks: named array of plugin packs, Object, where
  //       key: pack name (default native supplied - 'std'),
  //       value: supported operations list for given effect, Object where
  //         key: operation name,
  //         value: plugin operation function
  //
  //     return value: script, a list of operations.

  // Merged packs
  let packs = component.op;

  Object.keys(component.Effect).forEach(effectName => {
    if (effectName[0] !== effectName[0].toUpperCase()) {
      return;
    }

    basicScripts[effectName] = basicScripts[effectName] || (() => []);

    pluginPacks.forEach(({name, plugin, script}) => {
      // Merge available operations:
      if (plugin[effectName]) {
        if (!packs[name]) {
          packs[name] = {};
        }
        packs[name][effectName] = plugin[effectName];

        // Store default script reference for use by overriding code
        // Current way when overriding is to extend component.script
        // instance, but implementors may use op.std.script and
        // op.packN.script to access the full default script
        // of the corresponding component, not the inherited plugins chain.
        packs[name][effectName].script = script[effectName];
      }
    });


    // Get all plugins for current effect, Object,
    // key - plugin pack name,
    // value - available script operations for the effect.
    let thisEffectPacks = makeEffectPacks(effectName, packs);

    let currentScript = [];

    // Create updated defaults
    pluginPacks.forEach(({name, plugin, script}) => {
      const currentScriptCreator = basicScripts[effectName];
      const currentScript = currentScriptCreator(thisEffectPacks);

      // Assign new script creator:
      basicScripts[effectName] = (newPluginPacks) =>
        script[effectName](newPluginPacks, currentScript);
    });
  });

  return {...component, op: packs, script: basicScripts};
};

// External Available Plugins Mapper Config (global app-wide config):
AdvancedMain = extendComponentWithExternalPluginPacks(Main, externalMainPluginsPack1 /*, ... */);

const defaultScript = (component, effect) => component.script[effect](makeEffectPacks(effect, component.op));

const forEachEffect = (component, operation) => {
  Object.keys(component.Effect).forEach(effect => {
    if (effect[0] !== effect[0].toUpperCase()) {
      return;
    }

    operation(component, effect);
  });
};

// Current default scripts for each effect
forEachEffect(AdvancedMain, (component, effect) => console.log(defaultScript(component, effect)));

const obj = {};

const customizeEffects = (component, customizer) =>
  forEachEffect(component, (component, effect) => {
    const std = defaultScript(component, effect);
    const op = makeEffectPacks(effect, component.op);
    const mapper = customizer(op, effect, std);

    // Test each effect TODO: allowed actions engine!!!
    console.log('Testing', effect, 'effect:');
    mapper(obj, component.Effect[effect]());
  });

// TODO: rewrite this just to use 'op' and 'std' and return
// only Array, not functions.
const customConfig = customizeEffects(AdvancedMain,
  (op, effectName, std) => {
    const customPlugins = {
      Run: (state, effectInstance) =>
        [
          () => console.log('Running default op.pack1.script...'),
          // You can add any plugins default script too:
          ...op.pack1.script,

          () => console.log('Running custom user supplied sequence...'),
         
          // And sequence your own operations
          op.pack1.makeThisNow,
          () => console.log('Custom action'),
          
          // And, of course, get component default script
          // which is built by plugins inheritance chain:
          () => console.log('Running component\'s plugin packs chain script...'),
          ...std
        ].forEach(operation =>
          operation(state, effectInstance)),

    };
    const deflt = (state, effectInstance) => std.forEach(operation =>
          operation(state, effectInstance));
    return customPlugins[effectName] || deflt;
  });

/*
const mainEffectsConfig = {
  MA: 
}

 const mainState = Main.init(

*/



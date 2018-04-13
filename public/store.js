const Store = (() => {
  let state = {};
  const subscribers = [];
  const callbacks = [];
  const reducers = [];

  const dispatch = action => {
    state = reducers.reduce((acc, reducer) => {
      return reducer(acc, action);
    }, state);

    callbacks.forEach(callback => {
      callback(state, action);
    });
  };

  const subscribe = callback => {
    callbacks.push(callback);
  };

  const addReducer = reducer => {
    reducers.push(reducer);
  };

  const getState = () => {
    return state;
  };

  return {
    getState,
    dispatch,
    subscribe,
    addReducer
  };
})();

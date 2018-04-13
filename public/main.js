(async () => {
  const board = document.querySelector("[data-js=board]");

  const moveCard = (state, target) => {
    const { column, listItem } = state.dragStartData;

    const srcName = column.getAttribute("data-js");
    if (!srcName) throw new Error(`${srcName} is not a column`);

    const targetName = target.getAttribute("data-js");
    if (!targetName) throw new Error(`${targetName} is not a column`);

    const boardState = state.boardState;
    const srcColumn = boardState[srcName];
    const targetColumn = boardState[targetName];

    if (!srcColumn)
      throw new Error(`${srcName} does is not in the board state`);
    if (!targetColumn)
      throw new Error(`${targetName} does is not in the board state`);

    const srcCards = srcColumn.cards || [];
    const targetCards = targetColumn.cards || [];
    const title = listItem.firstChild.textContent;
    const card = srcCards.find(item => item.title === title);

    if (card && targetCards.indexOf(card) === -1) targetCards.push(card);

    boardState[srcName].cards = srcCards.filter(item => item.title !== title);
    boardState[targetName].cards = targetCards;

    return { ...state, boardState };
  };

  const reducer = (state, action) => {
    const { type, value } = action;

    switch (type) {
      case "INIT":
        return { ...state, boardState: value };

      case "DRAG_START":
        return { ...state, dragStartData: value };

      case "DROP":
        return moveCard(state, value);

      default:
        return state;
    }
  };

  const saveState = async boardState => {
    const options = {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify(boardState)
    };

    try {
      const res = await fetch("http://localhost:3000/board", options);
      const json = await res.json();
    } catch (error) {
      console.log(error);
      console.log("--------------------------");
      serviceWorker.postMessage(boardState);
    }
  };

  const onUpdate = (state, action) => {
    const { type, value } = action;

    switch (type) {
      case "DROP":
        clearChildren(board);
        render(state.boardState, board);
        saveState(state.boardState);
        break;

      default:
        break;
    }
  };

  const fetchBoardState = async () => {
    const res = await fetch("http://localhost:3000/board");
    return await res.json();
  };

  const render = (boardState, board) => {
    const keys = Object.keys(boardState);
    keys.forEach(key => {
      const item = new FirstColumnItem(key);
      const items = new ColumnItemList(boardState, key);
      const ulElement = new Column(key, [item, ...items]);
      board.appendChild(ulElement);
    });
  };

  // init
  Store.addReducer(reducer);
  Store.subscribe(onUpdate);

  const boardState = await fetchBoardState();
  Store.dispatch({ type: "INIT", value: boardState });
  render(boardState, board);
})();

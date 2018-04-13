// base elements

const makeElement = name => children => {
  const element = document.createElement(name);

  if (!children) {
    return element; // no children -> return the element
  } else if (typeof children === "string") {
    element.innerHTML = children;
    return element; // string -> set text
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
    return element; // node -> append
  } else if (Array.isArray(children)) {
    // array -> append each node
    return children.reduce((element, child) => {
      element.appendChild(child);
      return element;
    }, element);
  } else {
    throw new Error("Provided children is not of valid type", children);
  }
};

// define the elements we need
const ul = makeElement("ul");
const li = makeElement("li");
const h2 = makeElement("h2");
const p = makeElement("p");

// utils

const preventDefault = e => {
  e.preventDefault();
};

const clearChildren = el => {
  // we have to make a copy since we are removing
  // elements in the original array
  const nodes = [...el.childNodes];
  for (let child of nodes) {
    el.removeChild(child);
  }
};

// higher level elements

function FirstColumnItem(key) {
  const item = li(key);
  item.className = "column__item--first";
  return item;
}

function ColumnItem(todo) {
  const title = h2(todo.title);
  const desc = p(todo.description);
  const item = li([title, desc]);
  item.draggable = true;
  item.className = "column__item";
  return item;
}

function Column(name, listElements) {
  const ulElement = ul(listElements);
  ulElement.setAttribute("data-js", name);
  ulElement.className = "column";

  ulElement.addEventListener("dragstart", e => {
    const listItem = e.target;
    const column = e.target.parentNode;
    Store.dispatch({ type: "DRAG_START", value: { column, listItem } });
  });
  ulElement.addEventListener("dragover", preventDefault);
  ulElement.addEventListener("drop", e => {
    e.preventDefault();
    const value = e.target;
    Store.dispatch({ type: "DROP", value });
  });
  return ulElement;
}

function ColumnItemList(boardState, name) {
  const state = (boardState && boardState[name]) || {};
  const items = state.cards || [];
  return items.map(ColumnItem);
}

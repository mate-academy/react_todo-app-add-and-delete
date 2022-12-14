# TodoApp Checklist

## Basic React Checklist.
✓ PropTypes should describe objects and arrays, which are passed in the component.
✓ Use destructuring wherever possible. It makes code more readable.
✓ Functions should do one thing. Don't make monsters!)
✓ A variable name should describe what is stored in it.
✓ Use functional components with React Hooks.
✓ A function name should describe the result and starts from a verb.
   Follow [these](https://medium.com/javascript-in-plain-english/handy-naming-conventions-for-event-handler-functions-props-in-react-fc1cbb791364) naming conventions for functions.
✓ Use `classnames` lib for calculated classes.
✓ Use key attribute correctly (read [here](https://medium.com/blackrock-engineering/5-common-mistakes-with-keys-in-react-b86e82020052) for more details)

## Task checklist.
✓ `App.js` code should be split into several components.
✓ Callbacks that work with the main state should take prepared data instead of the whole child's state.
✓ Code should be split into small, reusable components if it possible (`Filter`, `TodoList`, `Todo`, `NewTodo`)
✓ ID for new todos should be unique, you can use an internal ID counter for this, and increment it.
✓ “Toggle all” should be active only in case when all todos are completed.
x If you manually toggle all todos to completed state, “Toggle all” should stay active.
✓ "Toggle all" should stay inactive if at least one todo is not completed.
✓ `NewTodo` form shouldn’t create empty todos.
✓ `NewTodo` form should trim redundant spaces.
✓ Do not rely on the unknown string, make constants for this.
    ```
    const FILTERS = {
      all: ‘all’,
      completed: ‘completed’,
      active: ‘active’,
    };
    ```
✓ Show only `NewTodo` form if todos array is empty.

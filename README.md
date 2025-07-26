<<<<<<< HEAD
# React Todo App Add and Delete

It is the second part of the React Todo App with API.

Take your code implemented for [Loading todos](https://github.com/mate-academy/react_todo-app-loading-todos)
and implement the ability to add and remove todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)
# ❗️❗️❗️</br>Please implement only adding and deleting todos in addition to what was already implemented.<br><br>All the other features from the working version will be implemented in the next task.</br>❗️❗️❗️

> Check the [API Documentation](https://mate-academy.github.io/fe-students-api/)

## Adding a todo

Add a todo with the entered title on the form submit:

- text field should be focused by default;
- if the title is empty show the `Title should not be empty` notification at the bottom;
- trim the title when checked or saved;
- use your `userId` for the new todo;
- send a POST request to the API (check the [API Documentation](https://mate-academy.github.io/fe-students-api/))
- disable the input until receiving a response from the API;
- immediately after sending a request create a todo with `id: 0` and save it to the `tempTodo` variable in the state (NOT to the `todos` array);
- show an independent `TodoItem` **after** the list if `tempTodo` is not `null`;
- temp TodoItem should have the loader (check the original markup);
- in case of success add the todo created by the API to the array (take it from the POST response);
- in case of an API error showing `Unable to add a todo` notification at the bottom;
- set `tempTodo` to `null` to hide the extra `TodoItem`;
- focus the text field after receiving a response;
- clear the text in case of success;
- keep the text in case of error;

> Don't try to implement animations for adding or removing Todos (at least until you finish everything else).
> If you really feel confident to try, there is a hint at the end of the description.

## Deleting todos

Remove a todo on the `TodoDeleteButton` click:

- covered the todo with the loader while waiting for the API response;
- remove the todo from the list on success;
- in case of API error show `Unable to delete a todo` notification at the bottom (the todo must stay in the list);

Remove all the completed todos after the `Clear completed` button click:

- the button should be enabled only if there is at least 1 completed todo;
- the deletion should work as several individual deletions running at the same time;
- in case of any error show error message but process success deletions;

## If you want to enable tests
- open `cypress/integration/page.spec.js`
- replace `describe.skip` with `describe` for the root `describe`

## Instructions
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://Knysh19.github.io/react_todo-app-add-and-delete/) and add it to the PR description.

## IF you want to implement smooth animations

<details>
  <summary>Click here to see the hint</summary>

  Use [React Transition Group](https://reactcommunity.org/react-transition-group/transition-group)

  ```tsx
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            isProcessed={processings.includes(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onUpdate={updateTodo}
          />
        </CSSTransition>
      ))}

      {creating && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={{
              id: Math.random(),
              title,
              completed: false,
              userId: user.id,
            }}
            isProcessed
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
  ```

  Here are the styles used in this example
  ```css
  .item-enter {
    max-height: 0;
  }

  .item-enter-active {
    overflow: hidden;
    max-height: 58px;
    transition: max-height 0.3s ease-in-out;
  }

  .item-exit {
    max-height: 58px;
  }

  .item-exit-active {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease-in-out;
  }

  .temp-item-enter {
    max-height: 0;
  }

  .temp-item-enter-active {
    overflow: hidden;
    max-height: 58px;
    transition: max-height 0.3s ease-in-out;
  }

  .temp-item-exit {
    max-height: 58px;
  }

  .temp-item-exit-active {
    transform: translateY(-58px);
    max-height: 0;
    opacity: 0;
    transition: 0.3s ease-in-out;
    transition-property: opacity, max-height, transform;
  }

  .has-error .temp-item-exit-active {
    transform: translateY(0);
    overflow: hidden;
  }
  ```
</details>
=======
# React Todo App Load Todos

You goal is to implement a simple Todo App that will save all changes to [the API](https://mate-academy.github.io/fe-students-api/).

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

The task consists of 3 part:
- (This repo) [Load todos](https://github.com/mate-academy/react_todo-app-loading-todos)
- [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
- [Toggle and Rename](https://github.com/mate-academy/react_todo-app-with-api)

In this 1st part you will:

- learn the markup in `App.tsx`
- learn `src/utils/fetchClient.ts` implementations and use it (or delete use any other approaches to interact with API)
- implement todos loading
- implement error messages
- implement filtering by status
- copy the final code to [the 2nd part](https://github.com/mate-academy/react_todo-app-add-and-delete)

## General principles

> Keep your logic as simple as possible!

Improve user experience:
- hide or disable elements that can't be used at the moment
- focus text fields, so user could start typing without extra clicks
- prevents users from doing the same action twice accidentally (disable controls when action is in progress)
- show spinners on todos immediately to notify the user that action is in progress
- update todos only after successful save to the API (tests expect such behaviour)
- in case of any error show a notification (and hide it after delay)
- clear input values on `success` and preserve and focus on `error`

## Tests

Tests help you to check if your implementation is correct.

- tests are grouped by functionality
- `.skip` after `it` or `describe` disables a test or a group of tests
- if you don't understand the test by its name, read its code in `cypress/integration/page.js`
- if you can't fix failed test ask mentors for help
- delays are important for tests, so make sure every request has `100` - `200` ms delay

## Load Todos by userID

1. Register a user by your email [here](https://mate-academy.github.io/react_student-registration/)
1. Save the received `userId` in the `api/todos.ts` and use it to load todos
1. reate some todos using the [Demo Page](https://mate-academy.github.io/react_todo-app-with-api/)
1. Load your todos when the `App` is loaded
1. hide the list and the footer if there are no todos yet;

## Show Error Messages

In case of any error show the notification with an appropriate message at the bottom

- the notification can be closed with the `close` button (add the `hidden` class, **DON'T** use conditional rendering);
- automatically hide the notification after 3 seconds;
- hide the notification before any next request;

You can use a wrong todos URL to test the error.

## Filter Todos by Status

Filter todos by status `All` / `Active` / `Completed`:

- all todos should be visible by default
- use the `selected` class to highlight a selected link;

## Common Instructions
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://Knysh19.github.io/react_todo-app-loading-todos/) and add it to the PR description.
>>>>>>> e06de6305110b2f524ac84c675ce3ecc21a73055

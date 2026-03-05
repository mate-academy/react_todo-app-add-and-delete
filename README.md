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
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://wiolip.github.io/react_todo-app-add-and-delete/) and add it to the PR description.

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

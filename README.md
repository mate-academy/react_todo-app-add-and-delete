# React Todo App Add and Delete

It is the second part of the React Todo App with API.

Take your code implemented for [Loading todos](https://github.com/mate-academy/react_todo-app-loading-todos)
and implement the ability to and nd remove todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

### [API Documentation](https://mate-academy.github.io/fe-students-api/)

## Adding a todo

Add a todo with the entered title on `NewTodoField` form submit:

- if the title is empty show the `Title can't be empty` notification at the bottom;
- disable the input until receiving the response from the API (use `isAdding` variable);
- manually add a temp todo with `id: 0` **after** the list while waiting for the response (don't add it to the array);
- show the loader on the added todo (see the styles of the 5th todo `Redux`);
- use your user id for the new todo;
- send the POST response to the API;
- in case of success and add the todo create by API to the array;
- in case of API error show `Unable to add a todo` notification at the bottom;
- the temp todo should be removed in any case;

> Don't try to implement smooth Todo adding or removing (at least until you implemented everything else).
> If you really fill confident to try, there is a hint at the end of the description.

## Deleting todos

Remove a todo on `TodoDeleteButton` click:

- covered the todo with the loader while wating for API response;
- remove the todo from the list on success;
- in case of API error show `Unable to delete a todo` notification at the bottom (the todo must stay in the list);

Remove all the completed todos after `Clear completed` button click:

- the button should be visible if there is at least 1 completed todo;
- the deletion should work as a several individual deletions running at the same time;

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Open one more terminal and run tests with `npm test` to ensure your solution is correct.
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://Reptioloid044.github.io/react_todo-app-add-and-delete/) and add it to the PR description.

## IF you want to implement smooth animations

<details>
  <summary>Click here to see the hint</summary>

  Use [React Transition Group](https://reactcommunity.org/react-transition-group/transition-group)

  ```tsx

  ```

  Here are the styles used in this example
  ```css
 
  ```
</details>

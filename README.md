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
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://reelow29.github.io/react_todo-app-loading-todos/) and add it to the PR description.

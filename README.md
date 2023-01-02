# React Todo App Add and Delete

It is the second part of the React Todo App with API.

Take your code implemented for [Loading todos](https://github.com/mate-academy/react_todo-app-loading-todos)
and implement the ability to and nd remove todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)
# ❗️❗️❗️</br>In this working example implemented all 3 parts of the task.</br>In this task you have to implement only the second part described below (using your code from the first part).</br>❗️❗️❗️

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

Додайте завдання із введеним заголовком у форму «NewTodoField»:

- якщо заголовок порожній, відображати сповіщення `Заголовок не може бути порожнім` внизу;
- заборонити введення до отримання відповіді від API (використовувати змінну isAdding);
- вручну додати тимчасове завдання з `id: 0` **після** списку під час очікування відповіді (не додавайте його до масиву);
- показати завантажувач на доданому завданні (див. стилі 5-го завдання `Redux`);
- використовувати свій ідентифікатор користувача для нового завдання;
- відправляти відповідь POST до API;
- у разі успіху та додати до масиву завдання, створене API;
- у разі помилки API відобразити сповіщення `Неможливо додати завдання` внизу;
- тимчасове завдання потрібно видалити в будь-якому випадку;

> Не намагайтеся реалізувати плавне додавання або видалення Todo (принаймні доки ви не реалізуєте все інше).
> Якщо ви дійсно заповнюєте впевненість, щоб спробувати, є підказка в кінці опису.

## Deleting todos

Remove a todo on `TodoDeleteButton` click:

- covered the todo with the loader while wating for API response;
- remove the todo from the list on success;
- in case of API error show `Unable to delete a todo` notification at the bottom (the todo must stay in the list);

Remove all the completed todos after `Clear completed` button click:

- the button should be visible if there is at least 1 completed todo;
- the deletion should work as a several individual deletions running at the same time;

Видалити завдання після натискання кнопки TodoDeleteButton:

- охопив завдання із завантажувачем, очікуючи відповіді API;
- видалити завдання зі списку в разі успіху;
- у разі помилки API відображати сповіщення `Неможливо видалити завдання` внизу (завдання має залишатися в списку);

Видаліть усі виконані завдання після натискання кнопки «Очистити завершене».

- кнопка має бути видимою, якщо є хоча б 1 виконане завдання;
- видалення має працювати як кілька окремих видалень, що виконуються одночасно;

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Open one more terminal and run tests with `npm test` to ensure your solution is correct.
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_todo-app-add-and-delete/) and add it to the PR description.

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

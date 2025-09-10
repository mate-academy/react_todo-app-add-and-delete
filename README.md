# React Todo App Add and Delete

It is the second part of the React Todo App with API.

Take your code implemented for [Loading todos](https://github.com/mate-academy/react_todo-app-loading-todos)
and implement the ability to add and remove todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)
# ❗️❗️❗️</br>Please implement only adding and deleting todos in addition to what was already implemented.<br><br>All the other features from the working version will be implemented in the next task.</br>❗️❗️❗️

> Check the [API Documentation](https://mate-academy.github.io/fe-students-api/)

## Adding a todo

Add a todo with the entered title on the form submit:



Додавання todo





Тимчасовий todo (tempTodo) потрібно показувати після списку справ, тільки якщо tempTodo не null.

Тимчасовий todo повинен показувати індикатор завантаження (loader).

Якщо запит успішний, додай todo, який прийшов від API, у масив todos.









Не намагайся робити анімації для додавання чи видалення todo, принаймні поки не закінчиш все інше.

Видалення todo

Видаляй todo при кліку на TodoDeleteButton.

Поки йде запит, накладай loader на видаляємий todo.

Якщо запит успішний — видаляй todo з масиву.

Якщо сталася помилка — показуй повідомлення Unable to delete a todo, todo залишай у списку.

Видалення всіх виконаних todo

Кнопка Clear completed повинна бути активною лише якщо є хоча б один виконаний todo.

Видаляти потрібно по черзі всі виконані todo (як кілька окремих запитів одночасно).

Якщо якийсь запит не вдався — показуй помилку, але інші успішні видалення повинні виконатися.

## Instructions
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://RuslanKonoplya.github.io/react_todo-app-add-and-delete/) and add it to the PR description.

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

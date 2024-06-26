import { useTodoTodos, useTodoTodoDependentApi } from './Context';
import { ErrorNotification } from './ErrorNotification';
import { Filter } from './Filter';
import { NewTodo } from './NewTodo';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import React from 'react';

export const TodoApp = React.memo(() => {
  const { todos, tempTodo } = useTodoTodos();
  const handleCompletedTodosRemove = useTodoTodoDependentApi();

  const amountOfLeftTodos = todos.reduce(
    (amount, todo) => (todo.completed ? amount : amount + 1),
    0,
  );

  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  const isEveryTodoNotCompleted = todos.every(todo => !todo.completed);

  const todosExist = !!todos.length || tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosExist && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isEveryTodoCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo />
        </header>

        <TodoList />

        {todosExist && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {amountOfLeftTodos} items left
            </span>

            <Filter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={isEveryTodoNotCompleted}
              onClick={handleCompletedTodosRemove}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
});

TodoApp.displayName = 'TodoApp';

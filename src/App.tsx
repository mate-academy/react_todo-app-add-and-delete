/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { Filter } from './Filter';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtered, setFiltered] = useState('all');
  const [titleTodo, setTitleTodo] = useState('');
  const [inputTodo, setInputTodo] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFocus.current && inputTodo) {
      inputFocus.current.focus();
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [inputTodo]);

  const filteredTodos = todos.filter(todo => {
    if (filtered === 'active') {
      return !todo.completed;
    }

    if (filtered === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const todosCounter = todos.filter(todo => !todo.completed).length;

  function deletePost(todoId: number) {
    deleteTodos(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  }

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    return postTodos({ userId, title, completed }).then(newTodo => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
    });
  }

  const HandleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo,
      completed: false,
    };

    setTempTodo(newTempTodo);

    setInputTodo(false);

    addTodo({
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    })
      .then(() => {
        setTitleTodo('');
      })
      .catch(() => {
        setInputTodo(true);
        setTempTodo(null);
      })
      .finally(() => {
        setInputTodo(true);
        setTempTodo(null);
      });
  };

  const HandleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const HandleErrorClose = () => {
    setErrorMessage('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {/* <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          /> */}

          {/* Add a todo on form submit */}
          <form onSubmit={HandleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={titleTodo}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={HandleTitle}
              ref={inputFocus}
              disabled={!inputTodo}
            />
          </form>
        </header>

        <TodoList
          tempTodo={tempTodo}
          onDelete={deletePost}
          todos={filteredTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter filtered={filtered} setFiltered={setFiltered} />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          onClick={HandleErrorClose}
          type="button"
          className="delete"
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};

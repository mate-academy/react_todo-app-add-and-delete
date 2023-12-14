/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postServices from './api/todos';
import { Todos } from './api/components/todos';
import { Footer } from './api/components/footer';
import { Error } from './api/components/error';
import { Loader } from './api/components/loader';

const USER_ID = 12030;

function getPreparedTodos(todos: Todo[], filter: string): Todo[] {
  const preparedTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;

      case 'active':
        return !todo.completed;

      default:
        return true;
    }
  });

  return preparedTodos;
}

// function error(er: string) {
//   switch (er) {
//     case 'load':
//       return 'Unable to load todos';
//     case 'empty':
//       return 'Title should not be empty';
//     case 'add':
//       return 'Unable to add a todo';
//     case 'delete':
//       return 'Unable to delete a todo';
//     case 'update':
//       return 'Unable to update a todo';
//     default: return '';
//   }
// }

function todosCounter(todos: Todo[]) {
  return todos.filter(todo => !todo.completed).length;
}

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedPostsIds, setdeletedPostsIds] = useState<number []>([]);

  function loadTodos() {
    setLoading(true);

    return postServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setLoading(false));
  }

  const inputField = useRef<HTMLInputElement>(null);

  if (inputField.current) {
    inputField.current.focus();
  }

  useEffect(() => {
    loadTodos();
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (postId: number) => {
    setdeletedPostsIds(curId => [...curId, postId]);
    postServices.deleteTodo(postId)
      .then(() => {
        setTodos(curTodos => curTodos.filter(t => t.id !== postId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTimeout(() => setdeletedPostsIds([]), 3000);
      });
  };

  const deleteAll = () => {
    todos.filter(t => t.completed)
      .map((todo) => deleteTodo(todo.id));
  };

  function addTodos({ userId, title, completed }: Todo) {
    if (title.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setInputDisabled(true);
    setLoading(true);

    postServices.addTodo({ userId, title, completed })
      .then(nTodo => {
        setTodos((curTodos) => [...curTodos, nTodo]);
        setNewTodo('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoading(false);
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  const handleSabmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newT = {
      id: 0,
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTempTodo(newT);
    addTodos(newT);
  };

  const visibleTodos = getPreparedTodos(todos, filter);
  const onFilter = (f: string) => {
    setFilter(f);
  };

  const onCloseError = (e: string) => {
    setErrorMessage(e);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div
        className="todoapp__content"
      >
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={visibleTodos.some(t => !t.completed)
              ? 'todoapp__toggle-all active'
              : 'todoapp__toggle-all'}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={handleSabmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              ref={inputField}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
          hidden={loading}
        >
          {visibleTodos.map(todo => (
            <Todos
              todo={todo}
              key={todo.id}
              onDelete={deleteTodo}
              deletedPostsIds={deletedPostsIds}
            />
          ))}

          {tempTodo && (

            <div
              data-cy="Todo"
              className={tempTodo.completed
                ? 'todo completed'
                : 'todo'}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <Loader />
            </div>
          )}

        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            filter={filter}
            onFilter={onFilter}
            count={todosCounter(todos)}
            showCCButton={!visibleTodos.some(todo => todo.completed)}
            deleteAll={deleteAll}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onCloseError={onCloseError}
      />
    </div>
  );
};

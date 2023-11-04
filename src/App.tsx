/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, {
  useEffect, useRef, useState,
} from 'react';
import * as todoAPI from './api/todos';
import { Todo } from './types/Todo';
// import { AuthContext } from './components/Context/Context';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11732;

export const App: React.FC = () => {
  // const user = useContext(AuthContext);
  const [creating, setCreating] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [type, setType] = useState<'all' | 'active' | 'completed'>('all');

  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  const [processings, setProcessings] = useState<number[]>([]);

  const addProcessing = (id: number) => {
    setProcessings(current => [...current, id]);
  };

  const removeProcessing = (idToRemove: number) => {
    setProcessings(current => current.filter(id => id !== idToRemove));
  };

  const timerId = useRef(0);

  function showError(message: string) {
    window.clearTimeout(timerId.current);

    setErrorMessage(message);

    if (!message) {
      return;
    }

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  }

  useEffect(() => {
    showError('');

    todoAPI.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!creating) {
      titleField.current?.focus();
    }
  }, [creating]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError('Title should not be empty');

      return;
    }

    showError('');
    setCreating(true);

    todoAPI.addTodo({
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setCreating(false));
  };

  const deleteTodo = async (todoId: number) => {
    addProcessing(todoId);
    showError('');

    return todoAPI.deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        removeProcessing(todoId);
        titleField.current?.focus();
      });
  };

  // const updateTodo = (updatedTodo: Todo) => {
  //   addProcessing(updatedTodo.id);
  //   showError('');

  //   return todoAPI.updateTodo(updatedTodo)
  //     .then(() => {
  //       setTodos(current => current.map(
  //         todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
  //       ));
  //     })
  //     .catch(error => {
  //       showError('Unable to update a todo');
  //       throw error;
  //     })
  //     .finally(() => removeProcessing(updatedTodo.id));
  // };

  const clearCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id).catch(() => {}));
  };

  // const toggleAll = () => {
  //   const allCompleted = activeTodos.length === 0;
  //   const todosToToggle = allCompleted ? completedTodos : activeTodos;

  //   todosToToggle.forEach(todo => {
  //     updateTodo({ ...todo, completed: !allCompleted }).catch(() => {});
  //   });
  // };

  const visibleTodos = todos.filter(todo => {
    switch (type) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <div className={classNames('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              // onClick={toggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleField}
              disabled={creating}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              isProcessed={processings.includes(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}

        </section>

        {(todos.length > 0 || creating) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                onClick={() => setType('all')}
                className={classNames('filter__link', { selected: type === 'all' })}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                onClick={() => setType('active')}
                className={classNames('filter__link', { selected: type === 'active' })}
              >
                Active
              </a>

              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                onClick={() => setType('completed')}
                className={classNames('filter__link', { selected: type === 'completed' })}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={completedTodos.length === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => showError('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};

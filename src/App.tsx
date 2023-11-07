/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, createTodo } from './api/todos';

const USER_ID = 11825;

type FilterBy = 'All' | 'Active' | 'Completed';
type ErrorMessage =
'' |
'Unable to load todos' |
'Title should not be empty' |
'Unable to add a todo' |
'Unable to delete a todo' |
'Unable to update a todo';

const filter = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case 'Active':
      return todos.filter(todo => !todo.completed || todo.id === 0);

    case 'Completed':
      return todos.filter(todo => todo.completed || todo.id === 0);

    default:
      return todos;
  }
};

const countActiveTodos = (todoList: Todo[]) => {
  const activeTodos = todoList.filter(todo => !todo.completed && todo.id !== 0);

  return activeTodos.length;
};

const countCompletedTodos = (todoList: Todo[]) => {
  const activeTodos = todoList.filter(todo => todo.completed);

  return activeTodos.length;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>('All');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const titleTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      });

    if (titleTodoRef.current) {
      titleTodoRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (titleTodoRef.current) {
      titleTodoRef.current.focus();
    }
  });

  const handleNewTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
      setIsLoading(false);

      return;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };
    const temporaryTodo = {
      ...newTodo,
      id: 0,
    };

    createTodo(USER_ID, newTodo)
      .then(todo => {
        setTodos(prev => {
          const filtred = prev.map((t) => (t.id === temporaryTodo.id ? todo : t));

          return filtred;
        });
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTodos(prev => (
          prev.filter(t => t.id !== temporaryTodo.id)));
      }).finally(() => {
        setIsLoading(false);
      });

    setTodos((prev) => [...prev, temporaryTodo]);
    setTempTodo(temporaryTodo);
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteCompletedTodos = () => {
    setIsLoading(true);
    const todosToDelete = todos.filter(todo => todo.completed);

    todosToDelete.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => setTodos(prev => prev.filter(currTodo => !currTodo.completed)))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => setIsLoading(false));
    });
  };

  const filteredTodos = filter(todos, filterBy);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleNewTodo}>
            <input
              ref={titleTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setNewTodoTitle(event.target.value)}
              value={newTodoTitle}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">

          {filteredTodos?.map(todo => (
            <>
              <div
                key={todo.id}
                data-cy="Todo"
                className={cn('todo', {
                  completed: todo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    defaultChecked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay',
                    { 'is-active': todo.id === tempTodo?.id && isLoading })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </>
          ))}

          {!!todos?.length && (
            // Hide the footer if there are no todos
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${countActiveTodos(todos)} items left`}
              </span>
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={cn('filter__link', {
                    selected: filterBy === 'All',
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilterBy('All')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={cn('filter__link', {
                    selected: filterBy === 'Active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilterBy('Active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={cn('filter__link', {
                    selected: filterBy === 'Completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilterBy('Completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className={cn('todoapp__clear-completed', {
                  'is-invisible': countCompletedTodos(todos) === 0,
                })}
                data-cy="ClearCompletedButton"
                onClick={handleDeleteCompletedTodos}
              >
                Clear completed
              </button>

              {/* don't show this button if there are no completed todos */}

            </footer>
          )}

        </section>
      </div>

      <div
        data-cy="ErrorNotification"
        /* eslint-disable max-len */
        className={cn('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
      {/* </div> */}
    </div>
  );
};

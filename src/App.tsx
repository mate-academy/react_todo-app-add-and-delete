/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { SortType } from './types/SortType';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { ErrorType } from './types/ErrorType';

const sortMethods = ['All', 'Active', 'Completed'];

function creatTempTodo(userId: number, title: string): Todo {
  return {
    id: 0,
    userId,
    title,
    completed: false,
  };
}

function sortTodo(todos: Todo[], sortType: SortType) {
  let newTodos = [...todos];

  if (sortType === SortType.ALL) {
    return newTodos;
  }

  newTodos = newTodos.filter(todo => {
    switch (sortType) {
      case SortType.ACTIVE:
        return !todo.completed;

      case SortType.COMPLETED:
        return todo.completed;

      default: return true;
    }
  });

  return newTodos;
}

const USER_ID = 10860;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  const noneError = (): void => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  };

  const newError = (error: ErrorType): void => {
    setErrorType(error);

    noneError();
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch {
        setErrorType(ErrorType.LOAD);

        noneError();
      }
    };

    loadTodos();
  }, []);

  const handleFilterChange = (
    methodSort: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();

    switch (methodSort) {
      case 'Active':
        setSortType(SortType.ACTIVE);
        break;

      case 'Completed':
        setSortType(SortType.COMPLETED);
        break;

      default:
        setSortType(SortType.ALL);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      newError(ErrorType.TITLE);

      return;
    }

    try {
      noneError();
      setTempTodo(creatTempTodo(USER_ID, todoTitle));

      const todo = await addTodo(USER_ID, todoTitle);

      setTodos([...todos, todo]);
      setTodoTitle('');
      setTempTodo(null);
    } catch {
      newError(ErrorType.ADD);
    }
  };

  const hadleDeleteTodo = async (todoId: number): Promise<void> => {
    try {
      noneError();

      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      newError(ErrorType.DELETE);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      noneError();

      await Promise.all(completedTodos.map(todoId => (deleteTodo(todoId))));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      newError(ErrorType.DELETE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = sortTodo(todos, sortType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          formSummit={handleFormSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />
        {/* <header className="todoapp__header">
          this buttons is active only if there are some active todos
          {todos.length !== 0 && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          Add a todo on form submit
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header> */}

        <TodoList
          visibaleTodos={visibleTodos}
          deleteTodo={hadleDeleteTodo}
          tempTodo={tempTodo}
        />

        {/* <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">{todo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          This is a completed todo
          <div className="todo completed">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">Completed Todo</span>

            Remove button appears only on hover
            <button type="button" className="todo__remove">×</button>

            overlay will cover the todo while it is being updated
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          This todo is not completed
          <div className="todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">Not Completed Todo</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          This todo is being edited
          <div className="todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            This form is shown instead of the title and remove button
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          This todo is in loadind state
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">Todo is being saved now</span>
            <button type="button" className="todo__remove">×</button>

            'is-active' class puts this modal on top of the todo
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section> */}

        {/* Hide the footer if there are no todos */}
        <Footer
          todos={todos}
          sortMethods={sortMethods}
          sortType={sortType}
          filterChange={handleFilterChange}
          clearCompletedTodos={handleClearCompleted}
        />
        {/* {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              3 items left
            </span>

            Active filter should have a 'selected' class
            <nav className="filter">
              {sortMethods.map(method => (
                <a
                  key={method}
                  href={`#/${method}`}
                  className={classNames(
                    'filter__link',
                    { selected: sortType === method },
                  )}
                  onClick={(event) => handleFilterChange(method, event)}
                >
                  {method}
                </a>
              ))}
            </nav>

            don't show this button if there are no completed todos
            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          </footer>
        )} */}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage(false)}
        />

        Unable to load the todos
      </div> */}
      <Notification
        errorType={errorType}
        noneError={noneError}
      />
    </div>
  );
};

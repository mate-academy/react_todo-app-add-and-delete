/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodos } from './api/todos';
import { Todo, TodoWithoutId } from './types/Todo';
import { TodoFilter } from './enums/TodoFilter.enum';
import { ErrorMessages } from './enums/ErrorMessages.enum';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TempTods } from './components/TempTods';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<TodoFilter>(TodoFilter.All);

  const [deleting, setDeleting] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addTodos = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = title.trim();

    if (trimmed === '') {
      setErrorMessage(ErrorMessages.TitleEmpty);

      return;
    }

    setErrorMessage('');

    setTempTodo({
      id: 0,
      title: trimmed,
      userId: USER_ID,
      completed: false,
    });

    //TODO: implement interface for TodoItem and use it instead of any
    const newTodo: TodoWithoutId = {
      title: trimmed,
      userId: USER_ID,
      completed: false,
    };

    setDisable(true);

    postTodos(newTodo)
      .then(response => {
        setTodos([...todos, response]);
        setTempTodo(null);
        setDisable(false);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToAddTodo);
        setTempTodo(null);
        setDisable(false);
        // setTitle('');
      });
  };

  const deleteTodos = (id: number) => {
    setDeleting([...deleting, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setDeleting(deleting.filter(todo => todo !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setDeleting(deleting.filter(todo => todo !== id));
        setErrorMessage(ErrorMessages.UnableToDeleteTodo);
      });
  };

  const resolveTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed === true);
    const Promises = completedTodos.map(todo => deleteTodos(todo.id));

    Promise.allSettled(Promises);
  };

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.UnableToLoadTodos));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  //filtering logic
  const visibleTodos = todos.filter(todo =>
    filterStatus === TodoFilter.Active
      ? !todo.completed
      : filterStatus === TodoFilter.Completed
        ? todo.completed
        : filterStatus === TodoFilter.All,
  );

  //focus
  useEffect(() => {
    if (inputRef.current !== null && !disable) {
      inputRef.current.focus();
    }
  }, [disable]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have active class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={addTodos}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={disable}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <div>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                visibleTodos={visibleTodos}
                deleting={deleting}
                onDelete={deleteTodos}
              />
              {tempTodo !== null && <TempTods tempTodo={tempTodo} />}
            </section>
            <Footer
              todos={todos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              resolveTodos={resolveTodos}
            />
          </div>
        )}
        <ErrorNotification
          onClose={() => setErrorMessage('')}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

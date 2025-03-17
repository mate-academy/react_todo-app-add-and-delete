/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { updateTodos } from './api/todos';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';

export enum Filter {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState([...todos]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTemptTodo] = useState<Todo | null>(null);

  function handleErrorMessage(message: string) {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage('Unable to load todos'));
    if (inputRef.current) {
      inputRef.current.focus(); // Focus input when component mounts
    }
  }, []);

  useEffect(() => {
    const todosFromServer = [...todos];

    switch (filter) {
      case Filter.ALL:
        setFilteredTodos(todosFromServer);
        break;
      case Filter.COMPLETED:
        setFilteredTodos(todosFromServer.filter(todo => todo.completed));
        break;
      case Filter.ACTIVE:
        setFilteredTodos(todosFromServer.filter(todo => !todo.completed));
        break;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function clearForm() {
    setInput('');
    setTemptTodo(null);
    setInputDisabled(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setErrorMessage('');
  }

  function removeTodo(todo: Todo) {
    return deleteTodo(todo)
      .then(() => {
        setTodos((prevTodos: Todo[]): Todo[] =>
          prevTodos.filter((item: Todo) => item.id !== todo.id),
        );
        inputRef.current?.focus();
      })
      .catch(() => handleErrorMessage('Unable to delete a todo'));
  }

  function changeTitle(todo: Todo, title: string) {
    const updatedTodo = { ...todo, title: title };

    return updateTodos(updatedTodo)
      .then(returnedTodo => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.map((item: Todo) =>
            item.id === returnedTodo.id ? returnedTodo : item,
          );
        });
      })
      .catch(error => {
        handleErrorMessage('Unable to update a todo');
        throw error;
      });
  }

  function markCompleted(todo: Todo) {
    const updatedTodo = { ...todo };

    updatedTodo.completed = !todo.completed;

    return updateTodos(updatedTodo)
      .then(returnedTodo => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.map((item: Todo) =>
            item.id === returnedTodo.id ? returnedTodo : item,
          );
        });
      })
      .catch(() => handleErrorMessage('Unable to update a todo'));
  }

  function chooseId() {
    if (todos) {
      const maxId = todos.reduce(
        (max, obj) => (obj.id > max ? obj.id : max),
        0,
      );

      return maxId + 1;
    }

    return 1;
  }

  function normalizeTodo(value: string): Todo {
    return {
      id: chooseId(),
      userId: USER_ID,
      title: value,
      completed: false,
    };
  }

  function handleCompleteAll() {
    const uncompletedTodos = [...todos].filter(todo => !todo.completed);

    if (uncompletedTodos.length === 0) {
      [...todos].map(todo => markCompleted(todo));
    }

    uncompletedTodos.map(todo => markCompleted(todo));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInputDisabled(true);

    if (!input.trim()) {
      handleErrorMessage('Title should not be empty');
      setInputDisabled(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    try {
      const readyTodo = normalizeTodo(input.trim());

      setTemptTodo({ ...readyTodo });
      const newTodo = await postTodos(readyTodo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      clearForm();
    } catch {
      handleErrorMessage('Unable to add a todo');
      setTemptTodo(null);
      setInputDisabled(false);
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  const allTodosCompleted = () => todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted(),
              })}
              data-cy="ToggleAllButton"
              onClick={handleCompleteAll}
            />
          )}

          <form onSubmit={e => handleSubmit(e)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={e => handleInputChange(e)}
              ref={inputRef}
              disabled={inputDisabled}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            removeTodo={removeTodo}
            markCompleted={markCompleted}
            changeTitle={changeTitle}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            removeTodo={removeTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

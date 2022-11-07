/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodosFilter, TodoError } from './types/TodoFilter';
import { ErrorInfo } from './components/ErrorInfo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [formInput, setFormInput] = useState('');
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.all);
  const [error, setError] = useState<TodoError>(TodoError.noerror);
  const [isAdding, setIsAdding] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = () => {
    getTodos(user?.id)
      .then(setTodos);
  };

  const todosFiltration = (filterType: TodosFilter) => {
    switch (filterType) {
      case TodosFilter.active:
        setVisibleTodos(todos.filter(todo => todo.completed === false));
        setFilter(TodosFilter.active);
        break;
      case TodosFilter.completed:
        setVisibleTodos(todos.filter(todo => todo.completed === true));
        setFilter(TodosFilter.completed);
        break;
      default:
        setVisibleTodos(todos);
        setFilter(TodosFilter.all);
    }
  };

  const errorTimeout = () => {
    setTimeout(() => {
      setError(TodoError.noerror);
    }, 3000);
  };

  const errorHandler = (errorType: TodoError) => {
    switch (errorType) {
      case TodoError.delete:
        setError(TodoError.delete);
        errorTimeout();
        break;
      case TodoError.update:
        setError(TodoError.update);
        errorTimeout();
        break;
      case TodoError.add:
        setError(TodoError.add);
        errorTimeout();
        break;
      case TodoError.empty:
        setError(TodoError.empty);
        errorTimeout();
        break;
      default:
        setError(TodoError.noerror);
    }
  };

  const errorButtonHandler = () => {
    setError(TodoError.noerror);
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsAdding(true);
    errorHandler(TodoError.noerror);
    const date = {
      userId: user?.id,
      title: formInput,
      completed: false,
    };

    if (formInput !== '') {
      try {
        await client.post('/todos', date);
      } catch {
        errorHandler(TodoError.add);
      }
    } else {
      setError(TodoError.empty);
      errorHandler(TodoError.empty);
    }

    setTimeout(() => {
      getTodosFromServer();
      setFormInput('');
      setIsAdding(false);
    }, 300);
  };

  const allCompletedButton = async () => {
    const iscompleted = todos.every(todo => todo.completed === true);

    try {
      if (iscompleted) {
        todos.forEach(todo => client.patch(`/todos/${todo.id}`, { completed: false }));
      } else {
        todos.filter(todo => todo.completed === false)
          .forEach(todo => client.patch(`/todos/${todo.id}`, { completed: true }));
      }
    } catch {
      errorHandler(TodoError.update);
    }

    setTimeout(() => {
      getTodosFromServer();
    }, 300);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  useEffect(() => {
    if (isAdding === false) {
      newTodoField.current?.focus();
    }
  }, [isAdding]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed === true),
              })}
              onClick={allCompletedButton}
            />
          )}

          <form onSubmit={submitHandler}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={formInput}
              disabled={isAdding}
              onChange={(event) => {
                setFormInput(event.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          todosUpdate={getTodosFromServer}
          errorHandler={errorHandler}
          isAdding={isAdding}
          formInput={formInput}
        />

        <Footer
          todos={todos}
          filterType={filter}
          todosFiltration={todosFiltration}
          todosUpdate={getTodosFromServer}
        />
      </div>

      <ErrorInfo
        errorType={error}
        errorButtonHandler={errorButtonHandler}
      />
    </div>
  );
};

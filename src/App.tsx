/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';

import { USER_ID } from './heplers/userId';
import * as dataOperations from './api/todos';

import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoError } from './components/TodoError/TodoError';
import { TodoFooter } from './components/TodoFooter/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoSelected, setIsTodoSelected] = useState('');
  const [isTodoLoading, setIsTodoLoading] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const errorTimerId = useRef(0);

  const showErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');
    dataOperations.getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodos = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    const temporaryTodo = {
      userId,
      title,
      completed,
      id: 0,
    };

    setTempTodo(temporaryTodo);
    setIsTodoLoading(temporaryTodo);
    setIsInputDisabled(true);

    return dataOperations.addTodos({ userId, title, completed })
      .then(todo => {
        setTodos(
          prev => [...prev, todo],
        );
      })
      .catch((error) => {
        setTodos(prev => prev.filter(t => t.id !== temporaryTodo.id));
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
        setIsTodoLoading(null);
      });
  };

  const deleteTodos = (todoId: number) => {
    setErrorMessage('');

    return dataOperations.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const onCheckedToggle = (todoId: number) => {
    setTodos(currentTodo => {
      return currentTodo.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      });
    });
  };

  let copyOfTodos = [...todos];

  switch (isTodoSelected) {
    case 'all':
      copyOfTodos = todos.filter(todo => todo);
      break;
    case 'active':
      copyOfTodos = todos.filter(todo => !todo.completed);
      break;
    case 'completed':
      copyOfTodos = todos.filter(todo => todo.completed);
      break;
    default: copyOfTodos = todos;
  }

  const count = todos.filter(todo => todo.completed !== true).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm
            onSubmit={addTodos}
            onErrorMessage={setErrorMessage}
            onQuery={setQuery}
            isInputDisabled={isInputDisabled}
            query={query}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            onDelete={deleteTodos}
            onCheckedToggle={onCheckedToggle}
            todos={copyOfTodos}
            isTodoLoading={isTodoLoading}
            tempTodo={tempTodo}
          />
        </section>

        {todos.length !== 0 && (
          <TodoFooter
            onTodoSelected={setIsTodoSelected}
            deleteTodos={deleteTodos}
            setTodos={setTodos}
            onErrorMessage={setErrorMessage}
            showErrorMessage={showErrorMessage}
            isTodoSelected={isTodoSelected}
            count={count}
            todos={todos}
          />
        )}
      </div>
      <TodoError
        onErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};

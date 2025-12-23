/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo, FilterType } from './types/Todo';
import { Header, ErrorNotification, TodoList, Footer } from './components';
import { useTodoSubmit, useTodoActions, useFilteredTodos } from './hooks';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onError = (errorString: string) => {
    setErrorMessage(errorString);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const { handleDelete, handleClearAll, loadingTodoIds } = useTodoActions({
    deleteTodo,
    onError,
    setTodos,
  });

  const { activeTodos, completedTodos } = todos.reduce(
    (acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo.id);
      } else {
        acc.activeTodos.push(todo);
      }

      return acc;
    },
    { activeTodos: [] as Todo[], completedTodos: [] as number[] },
  );

  const filteredTodos = useFilteredTodos(todos, filter);

  const handleTodoSubmit = useTodoSubmit({
    input,
    setInput,
    setTodos,
    setTempTodo,
    setErrorMessage,
    inputRef,
    onError,
    postTodo,
    USER_ID,
  });

  useEffect(() => {
    getTodos()
      .then((res: Todo[]) => {
        setTodos(res);
      })
      .catch(() => {
        onError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null && loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, loadingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          tempTodo={tempTodo}
          input={input}
          setInput={setInput}
          handleTodoSubmit={handleTodoSubmit}
        />
        <TodoList
          filteredTodos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearAll={() => handleClearAll(completedTodos)} // Wrap with function
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};

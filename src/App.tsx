/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { getFilteredTodos } from './utils/filterTodos';
import { TodoHeader } from './components/TodoHeader/TodoHeder';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

const USER_ID = 11509;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesssage, setErrorMesssage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>(FilterStatus.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrorMesssage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMesssage('Unable to load todos');

        setTimeout(() => {
          setErrorMesssage('');
        }, 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, selectedFilter);
  }, [todos, selectedFilter]);

  const removeTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMesssage('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMesssage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setIsDisable(true);

    addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then((newTodo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMesssage('Unable to add a todo');
      })
      .finally(() => {
        setIsDisable(false);
        setTempTodo(null);
      });
  };

  const clearCompletedTodos = () => {
    todos.filter(({ completed }) => completed)
      .forEach(({ id }) => {
        deleteTodo(id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
          })
          .catch(() => setErrorMesssage('Unable to delete a todo'));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isDisable={isDisable}
          onHandleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          todos={todos}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            isLoading={isLoading}
          />
        )}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            selectedFilter={selectedFilter}
            onSelectedFilter={setSelectedFilter}
          />
        )}

      </div>

      <ErrorNotification
        errorMesssage={errorMesssage}
        setErrorMesssage={setErrorMesssage}
      />
    </div>
  );
};

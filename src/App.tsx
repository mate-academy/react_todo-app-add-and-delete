/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage';
import { deleteTodo, getTodos } from './api/todos';

const USER_ID = 11827;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShowError, setIsShowError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<Todo | undefined>(
    undefined,
  );

  useEffect(() => {
    getTodos(USER_ID)
      .then((allTodos) => setTodos(allTodos as Todo[]))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setIsShowError(true);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter((todo) => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return Filter.All;
    }
  });

  const deleteTodoHandler = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));

    return deleteTodo(id)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setIsShowError(true);
        throw error;
      })
      .finally(() => {
        setDeletedTodoId(todos.find((todo) => todo.id === id));
        setDeletedTodoId(undefined);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setIsShowError={setIsShowError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletedTodoId={deletedTodoId}
              deleteTodoHandler={deleteTodoHandler}
            />

            <TodoFilter
              todos={todos}
              filterBy={filterBy}
              onFilterClick={setFilterBy}
            />
          </>
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        isShowError={isShowError}
        setIsShowError={setIsShowError}
      />
    </div>
  );
};

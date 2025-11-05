/* eslint-disable jsx-a11y/label-has-associated-control */

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { FilterStatus, ErrorMessages } from './types';
import { Todo, USER_ID } from './types';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { filterTodos } from './utils/fiterTodos';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [isDisabledInput, setDisableInput] = useState<boolean>(false);
  const [idTodoLoading, setIdTodoLoading] = useState<number[]>([]);
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [activeFilterStatus, setActiveFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [currentError, setCurrentError] = useState<ErrorMessages>(
    ErrorMessages.WithoutError,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setDisableInput(true);
        const data: Todo[] = await getTodos();

        setPreparedTodos(data);
      } catch (error) {
        setCurrentError(ErrorMessages.Load);
      } finally {
        setDisableInput(false);
      }
    };

    loadTodos();
  }, [currentError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(preparedTodos, activeFilterStatus);

  const handleCheckTodo = (id: number) => {
    setPreparedTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const quantityActiveTasks = preparedTodos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          quantityActiveTasks={quantityActiveTasks}
          preparedTodos={preparedTodos}
          isDisabledInput={isDisabledInput}
          inputRef={inputRef}
          onSetError={setCurrentError}
          onSetIdTodoLoading={setIdTodoLoading}
          onSetDisableInput={setDisableInput}
          onSetPreparedTodos={setPreparedTodos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          todoIdLoading={idTodoLoading}
          inputRef={inputRef}
          onCheckTodo={handleCheckTodo}
          onSetTodoIdLoading={setIdTodoLoading}
          onSetError={setCurrentError}
          onSetPreparedTodos={setPreparedTodos}
        />

        {preparedTodos.length > 0 && (
          <TodoFooter
            filteredTodos={preparedTodos}
            activeFilterStatus={activeFilterStatus}
            inputRef={inputRef}
            quantityActiveTasks={quantityActiveTasks}
            onChangeFilter={setActiveFilterStatus}
            onSetPreparedTodos={setPreparedTodos}
            onSetError={setCurrentError}
            onSetTodoIdLoading={setIdTodoLoading}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        onSetError={setCurrentError}
      />
    </div>
  );
};

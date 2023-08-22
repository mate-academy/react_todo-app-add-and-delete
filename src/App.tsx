/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todosService';
import { Todo } from './types/Todo';
import { Selected } from './types/Selected';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterTodos } from './components/FilterTodos';
import { ErrorMessage } from './components/ErrorMessage';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 11281;

function getPreparedTodos(
  todos: Todo[], selected: Selected,
) {
  switch (selected) {
    case Selected.ACTIVE: {
      return todos.filter(todo => !todo.completed);
    }

    case Selected.COMPLETED: {
      return todos.filter(todo => todo.completed);
    }

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.EMPTY);
  const [selected, setSelected]
  = useState<Selected>(Selected.ALL);

  useEffect(() => {
    setisLoading(true);
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(error => setErrorMessage(error.message || ErrorMessages.GET))
      .finally(() => setisLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(ErrorMessages.EMPTY);
      }, 3000);
    }
  }, [errorMessage]);

  const visibleTodos = useMemo(
    () => getPreparedTodos(todos, selected),
    [todos, selected],
  );
  const completedTodos = useMemo(
    () => visibleTodos.some(todo => todo.completed), [visibleTodos],
  );
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [visibleTodos],
  );
  const amountActive = activeTodos.length;
  const deleteTodo = (todoId: number) => {
    todosService.deleteTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const addTodo = ({ title, completed, userId }: Todo) => {
    setErrorMessage(ErrorMessages.EMPTY);
    todosService.creatTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {!isLoading && (
        <div className="todoapp__content">
          <Header
            userId={USER_ID}
            setErrorMessage={setErrorMessage}
            onSubmit={addTodo}
          />
          {todos.length !== 0 && (
            <>
              <TodoList
                todos={visibleTodos}
                onDelete={deleteTodo}
              />
              <FilterTodos
                amountActive={amountActive}
                completTodos={completedTodos}
                selected={selected}
                setSelected={setSelected}
              />
            </>
          )}
        </div>
      )}

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

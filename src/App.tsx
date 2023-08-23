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
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

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
    setisLoading(true);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return todosService.deleteTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(ErrorMessages.DELETE);
        throw error;
      })
      .finally(() => setisLoading(false));
  };

  const addTodo = ({
    title, completed, userId,
  }: Todo) => {
    setTempTodo({
      id: 0,
      userId,
      title,
      completed,
    });
    setErrorMessage(ErrorMessages.EMPTY);

    return todosService.creatTodo({ title, completed, userId })
      .then((newTodo) => setTodos((current) => [...current, newTodo]))
      .catch((error) => {
        setErrorMessage(ErrorMessages.ADD);
        throw error;
      })
      .finally(() => setTempTodo(null));
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
                tempTodo={tempTodo}
                isLoading={isLoading}
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

import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoSection } from './components/TodoSection/TodoSection';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { FilterContextProvider } from './context/FilterContext';
import { Notification } from './components/Notification/Notification';
import { ErrorType } from './types/ErrorType';

const USER_ID = 9955;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [hasError, setHasError] = useState(ErrorType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setHasError(ErrorType.LOADING));
  }, []);

  const handleAddTodo = useCallback((userId: number, data: Todo) => {
    setLoadingId(state => [
      ...state,
      data.id,
    ]);
    setTempTodo(data);
    setIsInputDisabled(true);
    setHasError(ErrorType.NONE);

    addTodos(userId, data)
      .then((response) => {
        setTodos(state => [
          ...state,
          response,
        ]);
      })
      .catch(() => setHasError(ErrorType.ADD))
      .finally(() => {
        setTempTodo(null);
        setLoadingId([]);
        setIsInputDisabled(false);
      });
  }, []);

  const handleRemoveTodo = useCallback((todoId: number) => {
    setLoadingId(state => ([
      ...state,
      todoId,
    ]
    ));
    setHasError(ErrorType.NONE);

    removeTodo(todoId)
      .then(() => setTodos(state => state.filter(todo => todo.id !== todoId)))
      .catch(() => setHasError(ErrorType.REMOVE))
      .finally(() => {
        setLoadingId(state => (
          state.filter(item => item !== todoId)
        ));
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isInputDisabled={isInputDisabled}
          setHasError={setHasError}
          onTodoAdd={handleAddTodo}
        />
        <FilterContextProvider>
          <TodoSection
            todos={todos}
            loadingId={loadingId}
            tempTodo={tempTodo}
            onRemove={handleRemoveTodo}
          />

          {todos.length > 0 && (
            <TodoFooter
              todos={todos}
              onRemove={handleRemoveTodo}
            />
          )}
        </FilterContextProvider>
      </div>

      <Notification
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};

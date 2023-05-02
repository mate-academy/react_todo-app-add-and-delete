import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoSection } from './components/TodoSection/TodoSection';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { FilterContextProvider } from './context/FilterContext';
import { Notification } from './components/Notification/Notification';
import { ErrorType } from './types/ErrorType';
import { NewTodo } from './types/NewTodo';

const USER_ID = 9955;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [hasError, setHasError] = useState(ErrorType.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setHasError(ErrorType.Loading));
  }, []);

  const handleAddTodo = useCallback((userId: number, title: string) => {
    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    const newTodo: NewTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setLoadingId(state => [
      ...state,
      temp.id,
    ]);
    setTempTodo(temp);
    setIsInputDisabled(true);
    setHasError(ErrorType.None);

    addTodo(userId, newTodo)
      .then((response) => {
        setTodos(state => [
          ...state,
          response,
        ]);
      })
      .catch(() => setHasError(ErrorType.Add))
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
    setHasError(ErrorType.None);

    removeTodo(todoId)
      .then(() => setTodos(state => state.filter(todo => todo.id !== todoId)))
      .catch(() => setHasError(ErrorType.Remove))
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

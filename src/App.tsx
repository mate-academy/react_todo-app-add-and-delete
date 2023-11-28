/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorTodo } from './types/ErrorTodo';
import * as todoServices from './api/todos';
import { Filter } from './types/Filter';
import { getPraperedTodos } from './services/todos';
import { TodoList } from './components/TodoList';

type Props = {
  userAccessId?: number;
};

export const App: React.FC<Props> = ({
  userAccessId = 11968,
}) => {
  // #region STATE
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ErrorTodo>(ErrorTodo.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  // #endregion

  const visibleTodos: Todo[] = getPraperedTodos(todos, filter);
  const activeTodos: Todo[] = getPraperedTodos(todos, Filter.ACTIVE);

  // #region HANDLER
  const handleFilterChange = (v: Filter) => setFilter(v);

  const handleErrorMsg = (er: ErrorTodo) => (() => setErrorMsg(er));
  // #endregion

  // #region load, add, update, delete
  const loadTodos = useCallback((userId: Todo['id']) => {
    return todoServices.getTodos(userId)
      .then(setTodos)
      .catch(handleErrorMsg(ErrorTodo.LOAD));
  }, []);

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'userId'>): Promise<Todo | void> => {
    setIsLoading(true);
    setTempTodo({ ...todo, userId: userAccessId, id: 0 });

    return todoServices.createTodo({ ...todo, userId: userAccessId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setIsLoading(false);

        return newTodo;
      })
      .catch(handleErrorMsg(ErrorTodo.UNABLE_ADD));
  }, [userAccessId]);

  const deleteTodo = useCallback((todoId: number) => {
    return todoServices.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(handleErrorMsg(ErrorTodo.UNABLE_DELETE));
  }, []);
  // #endregion

  // #region EFFECT
  useEffect(() => {
    setIsLoading(true);

    loadTodos(userAccessId)
      .finally(() => setIsLoading(false));
  }, [userAccessId, loadTodos]);
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
          onErrorCreate={(errMsg: ErrorTodo) => setErrorMsg(errMsg)}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={deleteTodo}
            />

            <TodoFooter
              filter={filter}
              onFilterChange={handleFilterChange}
              quantityActiveTodos={activeTodos.length}
              isAnyTodoComplete={todos.some(todo => todo.completed)}
            />
          </>
        )}
      </div>

      {!isLoading && (
        <ErrorNotification
          errorMsg={errorMsg}
          onErrorDelete={() => setErrorMsg(ErrorTodo.NONE)}
        />
      )}
    </div>
  );
};

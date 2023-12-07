import React, { useEffect, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import * as TodoServices from './api/todos';
import { FilterType } from './types/FilterType';
import { getPreparedTodos } from './utils/filterFunction';
import { TodoList } from './Components/TodoList';
import { TodoFooter } from './Components/TodoFooter';
import { TodoHeader } from './Components/TodoHeader';
import { ErrorNotification } from './Components/ErrorsNotification';

const USER_ID = 11128;

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number[]>([]);

  const visibleTodos = getPreparedTodos(todos, filterType);

  useEffect(() => {
    TodoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.getData);
      });
  }, []);

  const handleAddTodo = ({ title, completed, userId }: Todo) => {
    setLoading(true);

    return TodoServices.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((newError) => {
        throw newError;
      })
      .finally(() => setLoading(false));
  };

  const hanldeDeleteTodo = (todoId:number) => {
    setIdToDelete(curId => [todoId, ...curId]);

    return TodoServices.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch((newError) => {
        setError(ErrorType.deleteTodo);
        throw newError;
      })
      .finally(() => {
        setLoading(false);
        setIdToDelete([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          todos={todos}
          addTodo={handleAddTodo}
          setError={setError}
          setTempTodo={setTempTodo}
        />

        <TodoList
          loading={loading}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          deleteTodo={hanldeDeleteTodo}
          idToDelete={idToDelete}
        />

        {visibleTodos.length >= 0
        && (
          <TodoFooter
            setFilterType={setFilterType}
            todos={todos}
            filterType={filterType}
            hanldeDeleteTodo={hanldeDeleteTodo}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      <ErrorNotification
        errorMessage={error}
        closeError={setError}
      />
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { getPreparedTodos } from './utils/GetPrepatedTodos';
import { getAmountOfActiveTodos } from './utils/getAmountOfActiveTodos';
import { Footer } from './components/Footer/Footer';
import { Errors } from './utils/Errors';
import { ErrorsField } from './components/ErrorsField/ErrorsField';
import { Header } from './components/Header/Header';
import { USER_ID } from './utils/CONSTANTS';
import { deletingTodo } from './utils/deletingTodo';
import { handleGetTodos } from './utils/handleGetTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterInstructions, setFilterInstructions] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    handleGetTodos(setTodos, setErrorMessage);
  }, []);

  const handleDeleteTodo = (ids: number[]) => {
    return deletingTodo(ids, setErrorMessage, setTodos);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos(prevState => [...prevState, newTodo]);
  };

  const unfinishedTodoAmount = useMemo(
    () => getAmountOfActiveTodos(todos),
    [todos],
  );

  const completedTodosIds = useMemo(
    () => getPreparedTodos(todos, FilterTypes.Completed).map(todo => todo.id),
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = getPreparedTodos(todos, filterInstructions);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          unfinishedTodoAmount={unfinishedTodoAmount}
          todosLength={todos.length}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          onAddTodo={handleAddTodo}
        />

        <TodoList
          onDeleteTodo={handleDeleteTodo}
          todos={preparedTodos}
          tempTodo={tempTodo}
          onErrorMessageChange={setErrorMessage}
        />

        {!!todos.length && (
          <Footer
            unfinishedTodoAmount={unfinishedTodoAmount}
            filterInstructions={filterInstructions}
            setFilterInstructions={setFilterInstructions}
            completedTodosIds={completedTodosIds}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorsField
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};

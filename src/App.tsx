/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';

const USER_ID = 6650;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [sortType, setSortType] = useState(SortType.ALL);

  let visibleTodoList = todosList;

  switch (sortType) {
    case SortType.ACTIVE:
      visibleTodoList = todosList.filter(todo => !todo.completed);
      break;
    case SortType.COMPLETE:
      visibleTodoList = todosList.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  const fetchTodos = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodosList(todosData);
    } catch {
      setIsError(true);
      setErrorType('loading error');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const totalTodoListLength = todosList.length;
  const activeTodoListLength = todosList.filter(
    todo => !todo.completed,
  ).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header totalTodoListLength={totalTodoListLength} />

        <TodoList todos={visibleTodoList} />

        {totalTodoListLength !== 0 && (
          <Footer
            sortType={sortType}
            onSetSortType={setSortType}
            activeTodoListLength={activeTodoListLength}
          />
        )}

      </div>

      <ErrorNotification
        isError={isError}
        setIsError={setIsError}
        errorType={errorType}
      />
    </div>
  );
};

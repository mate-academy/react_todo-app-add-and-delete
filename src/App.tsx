/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

import { getTodos, addTodo } from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';

const USER_ID = 6650;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [sortType, setSortType] = useState(SortType.ALL);
  const [isDisabledForm, setIsDisabledForm] = useState(false);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

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

  const showError = (value: string) => {
    setIsError(true);
    setErrorType(value);
    window.setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const getTodosFromServer = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodosList(todosData);
    } catch {
      setIsError(true);
      showError('loading error');
    }
  };

  const addTodoOnServer = async () => {
    setIsDisabledForm(true);

    try {
      /* const todo = {
        id: 0,
        title: query,
        userId: USER_ID,
        completed: false,
      }; */

      // setTempTodo(todo);

      await addTodo(USER_ID, query);
      await getTodosFromServer();

      setIsDisabledForm(false);
      setQuery('');
      // setTempTodo(null);
    } catch {
      setQuery('');
      showError('add');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const totalTodoListLength = todosList.length;
  const activeTodoListLength = todosList.filter(
    todo => !todo.completed,
  ).length;
  const completedTodoListLength = totalTodoListLength - activeTodoListLength;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) {
      return showError('Title can\'t be empty');
    }

    return addTodoOnServer();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          totalTodoListLength={totalTodoListLength}
          query={query}
          onSetQuery={setQuery}
          isDisabledForm={isDisabledForm}
          handleSubmit={handleSubmit}
        />

        <TodoList todos={visibleTodoList} />

        {totalTodoListLength !== 0 && (
          <Footer
            sortType={sortType}
            onSetSortType={setSortType}
            activeTodoListLength={activeTodoListLength}
            completedTodoListLength={completedTodoListLength}
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

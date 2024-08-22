/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import classNames from 'classnames';
import { filterTodos } from './helper/utilsFunctions';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './types/ErrorMessage';
/* eslint-disable-next-line max-len */
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeletedTodoHasLoader, setIsDeletedTodoHasLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const areTodosExist = !!todos.length;
  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const isAnyCompletedTodos = notCompletedTodosCount === todos.length;

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const filteredTodos = filterTodos(todos, selectedTodos);
  const handleError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessage.LoadingError);
      });
  }, []);

  function handleDeleteTodoCLick(todoId: number) {
    setIsDeletedTodoHasLoader(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(currTodo => todoId !== currTodo.id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodoError);
      })
      .finally(() => setIsDeletedTodoHasLoader(false));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div
      className={classNames('todoapp', {
        'has-error': errorMessage.length > 0,
      })}
    >
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleError={handleError}
          todos={todos}
          errorMessage={errorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        {areTodosExist && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            handleDeleteTodoClick={handleDeleteTodoCLick}
            isDeletedTodoHasLoader={isDeletedTodoHasLoader}
          />
        )}
        {areTodosExist && (
          <Footer
            notCompletedTodosCount={notCompletedTodosCount}
            selectedTodos={selectedTodos}
            setSelectedTodos={setSelectedTodos}
            isAnyCompletedTodos={isAnyCompletedTodos}
            setIsDeletedTodoHasLoader={setIsDeletedTodoHasLoader}
            completedIds={completedIds}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

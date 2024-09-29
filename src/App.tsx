import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetchedTodos, setFetchedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>(
    'all',
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[] | null>(
    null,
  );

  const hasCompleted = fetchedTodos.find(todo => todo.completed)?.completed;

  const numOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const todoCounterTitle =
    (numOfActiveTodos !== 1
      ? `${numOfActiveTodos} items`
      : `${numOfActiveTodos} item`) + ' left';

  const errorMessageHandler = (er: Error) => {
    setIsHidden(false);
    setErrorMessage(er.message ?? er);

    new Promise(resolve =>
      setTimeout(() => {
        setIsHidden(true);
        setTimeout(() => resolve(''), 1000);
      }, 3000),
    ).then(() => setErrorMessage(''));
  };
  // <br />
  // Unable to update a todo

  useEffect(() => {
    getTodos()
      .then(serverTodos => {
        setTodos(serverTodos);
        setFetchedTodos(serverTodos);
      })
      .catch(errorMessageHandler);
  }, []);

  useEffect(() => {
    let filteredTodos = todos;

    if (filterBy !== 'all') {
      filteredTodos = todos.filter(todo =>
        filterBy === 'active' ? !todo.completed : todo.completed,
      );
    }

    setFetchedTodos([...filteredTodos]);
  }, [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onError={errorMessageHandler}
          onSuccess={setTodos}
          setTempTodo={setTempTodo}
          setIsHidden={setIsHidden}
        />
        <TodoList
          renderedList={fetchedTodos}
          tempTodo={tempTodo}
          todos={todos}
          forClear={completedTodoIds}
          setForClear={setCompletedTodoIds}
          onDelete={setTodos}
          onError={errorMessageHandler}
        />

        {/* Hide the footer if there are no todos */}
        {(tempTodo || !!todos.length) && (
          <Footer
            counterTitle={todoCounterTitle}
            filterBy={filterBy}
            setFilter={setFilterBy}
            completed={hasCompleted}
            todos={todos}
            onClearCompleted={setCompletedTodoIds}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        isHidden={isHidden}
        errorMessage={errorMessage}
        setIsHidden={setIsHidden}
      />
    </div>
  );
};

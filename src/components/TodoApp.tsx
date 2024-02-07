import React, { useState, useEffect, useContext } from 'react';
import { TodoContext } from '../Context/TodoContext';
import { UserWarning } from '../UserWarning';
import { Error } from './errorBlock/Error';
import { Footer } from './footer/Footer';
import { TodoList } from './TodoList/TodoList';
import { Header } from './header/Header';
import { getTodos } from '../api/todos';
import { Errors } from '../types/Errors';
import { Filter } from '../types/Filter';

const USER_ID = 54;

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const { hasError, setHasError } = useContext(TodoContext);
  const { errorType, setErrorType } = useContext(TodoContext);
  const [filter, setFilter] = useState(Filter.ALL);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setHasError(true);
        setErrorType(Errors.Load);
      });
  }, []);

  function filteredTodos() {
    switch (filter) {
      case Filter.ALL:
        return todos;
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header />
      <TodoList filteredTodos={filteredTodos()} />
      {todos.length > 0 && (
        <Footer
          setFilter={(filt) => setFilter(filt)}
          filter={filter}
        />
      )}
      {hasError && (
        <Error errorType={errorType} />
      )}
    </div>
  );
};

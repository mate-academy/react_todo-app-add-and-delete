/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Error } from './Error';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import { TodosContext } from './TodoContext';

const USER_ID = 9968;

export const App: React.FC = () => {
  const {
    todos, setTodos, isDeleteError, isAddError,
  } = useContext(TodosContext);
  const [filter, setFilter] = useState(FilterStatus.all);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const active = todos.filter(todo => todo.completed === false).length;
  const completed = todos.filter(todo => todo.completed).length;

  const toggleAll = todos.map(todo => (
    {
      ...todo,
      completed: true,
    }
  ));

  const untoggleAll = todos.map(todo => (
    {
      ...todo,
      completed: false,
    }
  ));

  let visibleTodos = [...todos];

  useEffect(() => {
    getTodos(USER_ID)
      .then(value => {
        setTodos(value);
        visibleTodos = value;
        setIsUpdateError(true);
      });
  }, []);

  switch (filter) {
    case FilterStatus.all:
      visibleTodos = [...todos];
      break;
    case FilterStatus.active:
      visibleTodos = [...todos].filter(todo => todo.completed === false);
      break;
    case FilterStatus.completed:
      visibleTodos = [...todos].filter(todo => todo.completed);
      break;
    default:
      break;
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          active={active}
          toggleAll={toggleAll}
          untoggleAll={untoggleAll}
          setTodos={(todosArray) => setTodos(todosArray)}
        />

        <TodoList
          visibleTodos={visibleTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            active={active}
            completed={completed}
            filter={filter}
            setFilter={(status) => setFilter(status)}
            setTodos={(todosArray) => setTodos(todosArray)}
          />
        )}
      </div>

      {isAddError && (
        <Error text="Unable to add a todo" />
      )}

      {isDeleteError && (
        <Error text="Unable to delete a todo" />
      )}

      {isUpdateError && (
        <Error text="Unable to update a todo" />
      )}
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterValue, setFilterValue] = useState<Filter>(Filter.All);

  const [todosInTheBoot, setTodosInTheBoot] = useState<number[]>([]);

  const hideAllErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        hideAllErrorMessage();
      });
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // DeleteTodo function
  const deleteTodo = (todoId: number) => {
    setTodosInTheBoot(currentBootTodos => [...currentBootTodos, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== todoId),
        );
        hideAllErrorMessage();
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header todos={todos} />
        <TodoList
          todos={filteredTodos}
          todosBoot={todosInTheBoot}
          deleteTodo={deleteTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterValue={filterValue}
            onClickFilter={setFilterValue}
            deleteTodo={deleteTodo}
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

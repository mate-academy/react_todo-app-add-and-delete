/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorType, FilterType, Todo } from './types';
import { deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 11968;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);

  const activeTodos = todoList.filter(todo => !todo.completed).length;
  const completedTodos = todoList.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => setErrorMessage(ErrorType.LOAD));
  }, []);

  const filterTodoList = (todoId: number) => {
    setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  };

  const handleAddTempTodo = (todo: Todo) => {
    setTodoList(prevState => [...prevState, todo]);
  };

  const handleRemoveTempTodo = () => {
    setTodoList(prevState => prevState.filter(todo => todo.id !== 0));
  };

  const todoListToShow = useMemo(() => {
    switch (filter) {
      case FilterType.COMPLETED:
        return todoList.filter(todo => !todo.completed);

      case FilterType.ACTIVE:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [todoList, filter]);

  const handleTodoAdded = (todo: Todo) => {
    setTodoList(prevTodos => [...prevTodos, todo]);
  };

  const clearCompleted = () => {
    const todoToClear = todoList.filter(todo => todo.completed);
    const deletePromise: Promise<unknown>[] = [];

    todoToClear.forEach(item => {
      const promise = deleteTodo(item.id)
        .catch(() => {
          setErrorMessage(ErrorType.DELETE);
          throw new Error();
        });

      deletePromise.push(promise);
    });

    Promise.all(deletePromise)
      .then(() => {
        setTodoList(prevState => prevState.filter(todo => !todo.completed));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          setErrorMessage={setErrorMessage}
          userId={USER_ID}
          handleTodoAdded={handleTodoAdded}
          handleAddTempTodo={handleAddTempTodo}
          handleRemoveTempTodo={handleRemoveTempTodo}
        />

        {todoListToShow && (
          <TodoList
            todoList={todoListToShow}
            filterTodoList={filterTodoList}
            setErrorMessage={setErrorMessage}
          />
        )}

        {todoList && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        clearErrorMessage={() => setErrorMessage(null)}
      />
    </div>
  );
};

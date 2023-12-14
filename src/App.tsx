/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter } from './types/FilterBy';
import { Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/TodoErrorNotification';
import { Errors } from './types/Errors';

const USER_ID = 11629;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const filterTodos = () => {
    switch (filterBy) {
      case Filter.All:
        return todos;

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMessage(Errors.loading));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return setErrorMessage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setIsError(true);

    return createTodo(newTodo)
      .then((finalTodo: Todo) => {
        setTodos(currentTodo => [...currentTodo, finalTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.add))
      .finally(() => {
        setIsError(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(currentTodo => [...currentTodo, todoId]);

    removeTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(Errors.delete))
      .finally(() => setIsLoading(currentTodo => currentTodo
        .filter((id:number) => id !== todoId)));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isDisable={isError}
          onHandleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
        />
        {todos.length > 0 && (
          <TodoList
            todos={filterTodos()}
            deleteTodo={deleteTodo}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
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

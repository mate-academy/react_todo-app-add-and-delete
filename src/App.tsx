/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { SortType } from './types/SortType';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { USER_ID, filterTodoList } from './utils/variables';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [sortBy, setSortBy] = useState<SortType>(SortType.All);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredTodos = filterTodoList(todos, sortBy);
  const completedTodo = filterTodoList(todos, SortType.Completed);
  const activeTodo = filterTodoList(todos, SortType.Active);

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setInputText(inputText);
    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(todo => {
        setTodos(current => [...current, todo]);
        setInputText('');
      })
      .catch(() => {
        setErrorMessage(Errors.AddingError);
        setInputText(inputText);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    deleteTodo(todoId)
      .catch(() => {
        setErrorMessage(Errors.DeletingError);
      })
      .finally(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
        setTempTodo(null);
      });
  };

  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
    setTodos(activeTodos);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadError));
  }, [setTodos]);

  useEffect(() => {
    if (!errorMessage) {
      return () => { };
    }

    const timerid = setTimeout(() => {
      setErrorMessage('');
    }, 2900);

    return () => clearTimeout(timerid);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={USER_ID}
          inputText={inputText}
          setInputText={setInputText}
          setError={setErrorMessage}
          handleAdd={handleAddTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {!!todos.length && (
          <>
            <TodoList todos={filteredTodos} deleteTodo={handleDeleteTodo} />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                key={tempTodo.id}
                deleteTodo={handleDeleteTodo}
                loading
              />
            )}
          </>
        )}

        {!!todos.length && (
          <Footer
            active={activeTodo}
            completed={completedTodo}
            setSortBy={setSortBy}
            sortBy={sortBy}
            deleteCompleted={handleDeleteCompleted}
          />
        )}

      </div>

      {/* {!!errorMessage.length && ( */}
      <div
        data-cy="ErrorNotification"
        className={
          classNames('notification is-danger is-light has-text-weight-normal',
            {
              hidden: !errorMessage,
            })
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        <br />
      </div>
      {/* )} */}

    </div>
  );
};

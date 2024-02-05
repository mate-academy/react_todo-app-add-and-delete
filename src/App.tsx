/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
// import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { SortType } from './types/SortType';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

const USER_ID = 103;

function filterTodoList(todos: Todo[], sortKey: SortType) {
  switch (sortKey) {
    case SortType.Completed:
      return todos.filter(todo => todo.completed);

    case SortType.Active:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [sortBy, setSortBy] = useState<SortType>(SortType.All);

  const filteredTodos = filterTodoList(todos, sortBy);

  const COMPLETED_TODO = filterTodoList(todos, SortType.Completed).length;
  const ACTIVE_TODO = todos.length - COMPLETED_TODO;

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setInputText(inputText);
    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(todo => {
        setTodos(current => [...current, todo]);
      })
      .catch(() => {
        setInputText(inputText);
        setErrorMessage(Errors.AddingError);
      })
      .finally(() => {
        setTempTodo(null);
      });

    setInputText('');
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
      .catch(() => setErrorMessage(Errors.LoadError))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [setTodos]);

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
        />

        {!!todos.length && (
          <TodoList todos={filteredTodos} deleteTodo={handleDeleteTodo} />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            key={tempTodo.id}
            deleteTodo={handleDeleteTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            active={ACTIVE_TODO}
            completed={COMPLETED_TODO}
            setSortBy={setSortBy}
            sortBy={sortBy}
            deleteCompleted={handleDeleteCompleted}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {!!errorMessage.length && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {/* show only one message at a time */}
          {errorMessage}
          <br />
        </div>
      )}

    </div>
  );
};

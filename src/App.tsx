import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErorrNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(Error.none);
  const [filter, setFilter] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const textField = useRef<HTMLInputElement>(null);

  const completedTodos = [...todos].filter(todo => todo.completed);
  const activeTodos = [...todos].filter(todo => !todo.completed);

  const filteredTodos = () => {
    switch (filter) {
      case Filter.Completed:
        return completedTodos;
      case Filter.Active:
        return activeTodos;
      default:
        return todos;
    }
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.unableToLoad);
      })
      .finally(() => {
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, [isInputLoading, todos.length]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          textField={textField}
          setErrorMessage={setErrorMessage}
          query={query}
          setQuery={setQuery}
          isInputLoading={isInputLoading}
          setIsInputLoading={setIsInputLoading}
          setTempTodo={setTempTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos()}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            deletingTodoIds={deletingTodoIds}
          />

          {tempTodo && (
            <TodoItem
              id={tempTodo.id}
              title={tempTodo.title}
              completed={tempTodo.completed}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              isInputLoading={isInputLoading}
              deletingTodoIds={deletingTodoIds}
            />
          )}
        </section>

        {!!todos.length && (
          <Footer
            setTodos={setTodos}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            setErrorMessage={setErrorMessage}
            filter={filter}
            setFilter={setFilter}
            setDeletingTodoIds={setDeletingTodoIds}
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

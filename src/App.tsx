import React, { useState, useEffect, useRef } from 'react';

import { USER_ID, createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FiilterBy';
import { ErrorNotification } from './ErrorNotification';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { Header } from './Header';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [titleText, setTitleText] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIDs, setDeletingIDs] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalizedTitle = titleText.trim();

    if (!normalizedTitle) {
      setErrorMessage(Errors.Empty);

      return;
    }

    setErrorMessage(null);
    setIsDisabled(true);

    const newTodo = {
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitleText('');
      })
      .catch(() => {
        setErrorMessage(Errors.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitleText(event.target.value);

  const handleClearingError = () => setErrorMessage(null);

  const handleChangingFilterBy = (value: FilterBy) => setFilterBy(value);

  const visibleTodos = getFilteredTodos(todos, filterBy);

  const activeTodosCount: number = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo: boolean = todos.some(todo => todo.completed);

  const handledeletingTodo = (id: number) => {
    setDeletingIDs(curIDs => [...curIDs, id]);

    removeTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => {
        setDeletingIDs(curIDs => curIDs.filter(curID => curID !== id));
        inputRef.current?.focus();
      });
  };

  const handleClearingCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handledeletingTodo(todo.id);
      }
    });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          isDisabled={isDisabled}
          titleText={titleText}
          onSubmit={handleSubmit}
          onType={handleTyping}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handledeletingTodo}
              deletingIDs={deletingIDs}
            />

            <Footer
              onFilterClick={handleChangingFilterBy}
              activeTodosCount={activeTodosCount}
              onClearCompleted={handleClearingCompletedTodos}
              selectedFilterBy={filterBy}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onDeleteError={handleClearingError}
      />
    </div>
  );
};

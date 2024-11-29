/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { AddNewTodo } from './components/AddNewTodo/AddNewTodo';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [filterQuery, setFilterQuery] = useState('all');
  const [focusRequested, setFocusRequested] = useState(false);

  // LOAD TODOs
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  // part of 'ADD TODO' logic
  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  // part of 'DELETE TODO' logic
  const removeDeletedTodo = (id: number) => {
    const todoToDelete = todos.find(item => item.id === id);

    if (todoToDelete) {
      const updatedTodos = todos.filter(todo => todo.id !== id);

      setTodos(updatedTodos);
    } else {
      setErrorMessage('Todo cannot be removed as it is not there already');
    }

    setFocusRequested(true);
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => todo)
          .catch(() => {
            setErrorMessage('Unable to delete a todo');

            return null;
          }),
      ),
    ).then(results => {
      const successfulDeletedIds = results
        .filter(
          result => result.status === 'fulfilled' && result.value !== null,
        )
        .map(result => (result as PromiseFulfilledResult<Todo>).value.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulDeletedIds.includes(todo.id)),
      );

      setFocusRequested(true);
    });
  };

  // FILTER TODOs
  const filteredTodos = useMemo(() => {
    switch (filterQuery) {
      case 'active': {
        return todos.filter(todo => !todo.completed);
      }

      case 'completed': {
        return todos.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }, [filterQuery, todos]);

  // COUNT TODOs
  const activeTodoCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodoCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  // ERROR NOTIFICATION handling

  const errorNoticeRef = useRef<HTMLDivElement>(null);
  const errorNoticeDiv = errorNoticeRef.current as HTMLDivElement;

  const hideErrorNotice = () => {
    errorNoticeDiv.classList.add('hidden');
  };

  // INITIAL CHECK FOR USER ID REGISTRATION
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            // ToggleAllButton button has `active` class only if all todos are completed
            className={cn('todoapp__toggle-all', {
              active: completedTodoCount && completedTodoCount === todos.length,
            })}
            data-cy="ToggleAllButton"
          />

          <AddNewTodo
            setErrorMessage={setErrorMessage}
            addTodo={addTodo}
            setTempTodo={setTempTodo}
            focusRequested={focusRequested}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          removeDeletedTodo={removeDeletedTodo}
        />

        {/* The Footer is shown ONLY when there are any todos to be listed */}
        {todos.length > 0 && (
          <Footer
            activeTodoCount={activeTodoCount}
            completedTodoCount={completedTodoCount}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        hideErrorNotice={hideErrorNotice}
        errorNoticeRef={errorNoticeRef}
      />
    </div>
  );
};

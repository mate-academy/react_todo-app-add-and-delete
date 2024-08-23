/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { errorMessages, ErrorMessages } from './types/ErrorMessages';
import { addTodos, getTodos } from './api/todos';
import { USER_ID } from './api/todos';
import { getFilteredList } from './utils/getFilteredList';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const commonTodoProperties = {
  userId: USER_ID,
  completed: false,
};

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isClearTitle, setIsClearTitle] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessages | null>(null);

  useEffect(() => {
    getTodos()
      .then(data => setTodosList(data))
      .catch(() => {
        setError(errorMessages.load);
      });
  }, []);

  useEffect(() => {
    let timerId = 0;

    if (error) {
      timerId = window.setTimeout(() => setError(null), 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  function handleHideError() {
    setError(null);
  }

  const filteredList = getFilteredList(filter, todosList);
  const activeListLength = getFilteredList(Filter.active, todosList)?.length;
  const completedTodos = getFilteredList(Filter.completed, todosList);
  // const isCompletedTodos = completedTodos.length > 0;
  const isAllTodosCompleted = completedTodos.length === todosList.length;

  function handleAddingTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const title = event.currentTarget.value.trim();

      if (!title) {
        setError(errorMessages.title);

        return;
      }

      setIsSubmiting(true);
      setTempTodo({
        title,
        ...commonTodoProperties,
        id: 0,
      });

      addTodos({
        title,
        ...commonTodoProperties,
      })
        .then(newTodo => {
          setTodosList(prevList => [...prevList, newTodo]);
          setIsClearTitle(true);
        })
        .catch(() => setError(errorMessages.add))
        .finally(() => {
          setIsSubmiting(false);
          setTempTodo(null);
        });
    }
  }

  function onHandleDeleteTodo(deleteTodoIds: number[]) {
    setTodosList(prevTodoList =>
      prevTodoList.filter(({ id }) => !deleteTodoIds.includes(id)),
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onHandleAddingTodo={handleAddingTodo}
          isAllTodosCompleted={isAllTodosCompleted}
          isSubmiting={isSubmiting}
          isClearTitle={isClearTitle}
          onSetIsClearTitle={setIsClearTitle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredList?.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onHandleDeleteTodo={onHandleDeleteTodo}
              onSetError={setError}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isSubmiting={isSubmiting}
              onSetError={setError}
            />
          )}
        </section>

        {todosList.length > 0 && (
          <Footer
            onSetFilter={setFilter}
            activeListLength={activeListLength}
            currentFilter={filter}
            completedTodos={completedTodos}
            onHandleDeleteTodo={onHandleDeleteTodo}
            onSetError={setError}
          />
        )}
      </div>
      <ErrorNotification error={error} onHandleHideError={handleHideError} />
    </div>
  );
};

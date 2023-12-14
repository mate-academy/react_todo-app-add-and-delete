/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterType';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoError } from './components/TodoError';

export const USER_ID = 11271;

function getVisibleTodos(todos: Todo[], filter: FilterType) {
  switch (filter) {
    case FilterType.Active:
      return todos.filter((todo) => !todo.completed);
    case FilterType.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [filter, setFilter] = useState(FilterType.All);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIds, setProcessedIds] = useState<number[]>([]);

  function loadPosts() {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setIsLoading(true);
    setErrorMessage(ErrorMessage.None);

    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    todoService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(last => [...last, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function deleteTodo(todoId: number) {
    setProcessedIds(prev => [...prev, todoId]);
    setErrorMessage(ErrorMessage.None);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => setProcessedIds(processedIds));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    addTodo({
      title: newTitle,
      completed: false,
      userId: USER_ID,
    });
  };

  useEffect(loadPosts, []);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onSubmit={handleSubmit}
          title={newTitle}
          setTitle={setNewTitle}
          isLoading={isLoading}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
              processings={processedIds}
            />
            <TodoFilter
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              onDelete={deleteTodo}
            />
          </>
        )}
      </div>

      <TodoError
        error={errorMessage}
        onErrorChange={setErrorMessage}
      />
    </div>
  );
};

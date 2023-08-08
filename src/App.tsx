/* eslint-disable max-len *//* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { SelectedCategory } from './types/SelectedCategory';
import { ErrorMessage } from './types/ErrorMessage';

import * as todoService from './api/todos';

import { TEMP_TODO_ID, USER_ID } from './utils/constants';

import { ToggleAll } from './component/ToggleAll';
import { TodoInList } from './component/TodoInList';
import { NewTodo } from './component/NewTodo';
import { Filter } from './component/Filter';
import { ClearCompleted } from './component/ClearCompleted';
import { ErrorNotification } from './component/ErrorNotification';

function filter(todos: Todo[], category: SelectedCategory) {
  switch (category) {
    case SelectedCategory.Active:
      return [...todos].filter(todo => !todo.completed);

    case SelectedCategory.Completed:
      return [...todos].filter(todo => todo.completed);

    default:
      return [...todos];
  }
}

const showError = (
  message: ErrorMessage,
  set: (error: ErrorMessage | null) => void,
) => {
  set(message);

  setTimeout(() => {
    set(null);
  }, 3000);
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState<SelectedCategory>(SelectedCategory.All);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load, setError));
  }, []);

  const filteredTodos = useMemo(() => {
    return filter(todos, category);
  }, [todos, category]);

  const countActiveTodos = useMemo(() => {
    return todos.reduce((prev, todo) => {
      if (!todo.completed) {
        return prev + 1;
      }

      return prev;
    }, 0);
  }, [todos]);

  function deleteTodo(todoId: number) {
    setLoadingTodosIds(ids => [...ids, todoId]);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessage.Delete, setError);

        throw new Error();
      })
      .finally(() => {
        setLoadingTodosIds(ids => ids.filter(id => id !== todoId));
      });
  }

  function addTodo(title: string) {
    setTempTodo({
      title,
      id: TEMP_TODO_ID,
      userId: USER_ID,
      completed: false,
    });

    setLoadingTodosIds(ids => [...ids, TEMP_TODO_ID]);

    if (title.trim() === '') {
      showError(ErrorMessage.Title, setError);

      return setTempTodo(null);
    }

    return todoService.addTodo({ title })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        showError(ErrorMessage.Add, setError);

        throw new Error();
      })
      .finally(() => {
        setLoadingTodosIds([]);
        setTempTodo(null);
      });
  }

  function handleClearCompleted() {
    setLoadingTodosIds(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));

    todos
      .filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id));
  }

  function handleNewTodoSubmit(event: React.FormEvent) {
    event.preventDefault();

    addTodo(query);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAll
            activeTodos={countActiveTodos}
          />

          <NewTodo
            query={query}
            setQuery={setQuery}
            onSubmit={handleNewTodoSubmit}
          />
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              {filteredTodos.map(todo => (
                <TodoInList
                  key={todo.id}
                  todo={todo}
                  loadingTodosIds={loadingTodosIds}
                  setLoadingTodosIds={setLoadingTodosIds}
                  deleteTodo={deleteTodo}
                />
              ))}

              {tempTodo && (
                <TodoInList
                  key={tempTodo.id}
                  todo={tempTodo}
                  loadingTodosIds={loadingTodosIds}
                  setLoadingTodosIds={setLoadingTodosIds}
                  deleteTodo={deleteTodo}
                />
              )}
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${countActiveTodos} items left`}
              </span>

              <Filter
                category={category}
                onClick={setCategory}
              />

              <ClearCompleted
                todos={todos}
                countActiveTodos={countActiveTodos}
                onClearCompleted={handleClearCompleted}
              />
            </footer>
          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={() => setError(null)}
        />
      )}
    </div>
  );
};

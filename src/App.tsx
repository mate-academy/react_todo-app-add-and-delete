/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { SelectedCategory } from './types/SelectedCategory';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { NewTodo } from './components/NewTodo';
import { TodoInList } from './components/TodoInList';
import { ToggleAll } from './components/ToggleAll';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './components/Filter';
import { TEMP_TODO_ID, USER_ID } from './utils/constants';

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

const showError = (message: ErrorMessage, set: (error: ErrorMessage | null) => void) => {
  set(message);

  setTimeout(() => {
    set(null);
  }, 3000);
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [category, setCategory] = useState<SelectedCategory>(SelectedCategory.All);
  const [query, setQuery] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load, setError));
  }, []);

  const filteredTodos = filter(todos, category);
  const countActiveTodos = todos.reduce((prev, todo) => {
    if (!todo.completed) {
      return prev + 1;
    }

    return prev;
  }, 0);

  const allCompleted = todos.every(todo => todo.completed) && todos.length !== 0;

  function deleteTodo(todoId: number) {
    setLoadingTodosIds(ids => [...ids, todoId]);

    return todoService.deleteTodos(todoId)
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
      id: TEMP_TODO_ID, userId: USER_ID, completed: false, title,
    });

    setLoadingTodosIds(ids => [...ids, TEMP_TODO_ID]);

    if (title.trim() === '') {
      setTempTodo(null);
      showError(ErrorMessage.Title, setError);

      throw new Error();
    }

    return todoService.addTodos({ title })
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

  function updateTodo(updatedTodo: Todo) {
    // setError(null);
    // setIsLoading(true);
    // setLoadingTodosId([updatedTodo.id]);
    setLoadingTodosIds(ids => [...ids, updatedTodo.id]);

    // if (updatedTodo.title.trim() === '') {
    //   showError(ErrorMessage.Title, setError);

    //   return new Error();
    // }

    return todoService.updateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(td => td.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setError(ErrorMessage.Update);

        throw new Error();
      })
      .finally(() => {
        // setIsLoading(false);
        setLoadingTodosIds(ids => ids.filter(id => id !== updatedTodo.id));
      });
  }

  function handleKeyDownOnTodo(event: React.KeyboardEvent<HTMLInputElement>, todo: Todo, title: string) {
    if (event.key === 'Enter') {
      event.preventDefault();

      setEditingTodoId(null);

      if (title !== todo.title) {
        if (todo.title.trim() === '') {
          showError(ErrorMessage.Title, setError);

          return todoService.getTodos(USER_ID).then(setTodos);
        } else {
          updateTodo(todo);

          return todoService.getTodos(USER_ID).then(setTodos);
        }
      }

      return todoService.getTodos(USER_ID).then(setTodos);
    }

    if (event.key === 'Escape') {
      setEditingTodoId(null);

      return todoService.getTodos(USER_ID).then(setTodos);
    }

    return todoService.getTodos(USER_ID).then(setTodos);
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
            allCompleted={allCompleted}
            onToggleAll={() => {
              todos
                .filter(todo => todo.completed === allCompleted)
                .forEach((todo) => updateTodo({ ...todo, completed: !todo.completed }));
            }}
          />

          <NewTodo
            query={query}
            onQueryChange={setQuery}
            loadingTodosIds={loadingTodosIds}
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();

              addTodo(query);
            }}
          />
        </header>

        {todos.length !== 0 && (
          <>
            <section className="todoapp__main">
              {filteredTodos.map(todo => (
                <TodoInList
                  todo={todo}
                  setLoadingTodosIds={setLoadingTodosIds}
                  deleteTodos={deleteTodo}
                  updateTodos={updateTodo}
                  loadingTodosIds={loadingTodosIds}
                  key={todo.id}
                  onKeyDown={handleKeyDownOnTodo}
                  editingTodoId={editingTodoId}
                  setEditingTodoId={setEditingTodoId}
                />
              ))}

              {
                tempTodo && (
                  <TodoInList
                    todo={tempTodo}
                    setLoadingTodosIds={setLoadingTodosIds}
                    deleteTodos={deleteTodo}
                    updateTodos={updateTodo}
                    loadingTodosIds={loadingTodosIds}
                    key={tempTodo.id}
                    onKeyDown={handleKeyDownOnTodo}
                    editingTodoId={editingTodoId}
                    setEditingTodoId={setEditingTodoId}
                  />
                )
              }
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${countActiveTodos} items left`}
              </span>

              <Filter
                category={category}
                onClick={setCategory}
              />

              <button
                type="button"
                className={classNames('todoapp__clear-completed', { hidden: todos.length === countActiveTodos })}
                onClick={() => {
                  setLoadingTodosIds(todos
                    .filter(todo => todo.completed)
                    .map(todo => todo.id));

                  todos.filter(todo => todo.completed)
                    .map(todo => deleteTodo(todo.id));
                }}
              >
                Clear completed
              </button>
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

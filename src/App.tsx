/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { FilterTypes } from './types/FilterType';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import Header from './Components/Header';
import TodoList from './Components/TodoList';
import Footer from './Components/Footer';
import cn from 'classnames';

interface OnDblClickParams {
  index: number;
  todo: Todo;
}

export const App: React.FC = () => {
  const [todosDb, setTodosDb] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToShow, setTodosToShow] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(
    FilterTypes.ALL,
  );
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  useEffect(() => {
    setTodosToShow(
      todosDb.filter(todo => {
        switch (selectedFilter) {
          case FilterTypes.ACTIVE:
            return !todo.completed;
          case FilterTypes.COMPLETED:
            return todo.completed;
          default:
            return true;
        }
      }),
    );
  }, [todosDb, selectedFilter]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setTodosDb(await getTodos());
      } catch (err) {
        setError('Unable to load todos');
      } finally {
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const focusField = () => {
    setTimeout(() => {
      const inputField =
        document.querySelector<HTMLInputElement>('.todoapp__new-todo');

      inputField?.focus();
    }, 0);
  };

  const deleteTodoFunc = async (id: number) => {
    setLoadingTodoId(id);
    setError(null);
    try {
      await deleteTodo(id);
      setTodosDb(todosDb.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
      focusField();
    }
  };

  const completeTodo = async (id: number, completed: boolean) => {
    setLoadingTodoId(id);
    setError(null);
    try {
      await updateTodo(id, { completed });
      setTodosDb(
        todosDb.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed };
          }

          return todo;
        }),
      );
    } catch (err) {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const updateTodoFunc = async (
    id: number,
    title: string,
    e?: React.FormEvent<HTMLFormElement>,
  ) => {
    e?.preventDefault();
    setLoadingTodoId(id);
    setError(null);
    try {
      await updateTodo(id, { title: title.trim() });
      setTodosDb(
        todosDb.map(todo => {
          if (todo.id === id) {
            return { ...todo, title: title.trim() };
          }

          return todo;
        }),
      );
    } catch (err) {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoId(null);
    }

    setEditValue('');
    setEditIndex(null);
  };

  const addTodo = async (
    e: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    e.preventDefault();
    setError(null);
    setInputLoading(true);
    setTempTodo({
      title: title.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    });

    if (!title.trim()) {
      setInputLoading(false);
      setError('Title should not be empty');

      return;
    }

    try {
      const todo = await createTodo(title);

      setTodosDb([...todosDb, todo]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Unable to add a todo');
    } finally {
      focusField();
      setInputLoading(false);
      setTempTodo(null);
    }
  };

  const onDblClick = ({ index, todo }: OnDblClickParams) => {
    setEditIndex(index);
    setEditValue(todo.title);
  };

  const clearCompleted = async () => {
    setError(null);

    const completedTodos = todosDb.filter(todo => todo.completed);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo =>
          client.delete(`/todos/${todo.id}`).then(() => todo),
        ),
      );

      const successfulTodos = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Todo>).value);

      const failedTodos = results
        .filter(result => result.status === 'rejected')
        .map((_, index) => completedTodos[index]);

      setTodosDb(prevTodos =>
        prevTodos.filter(
          todo =>
            !successfulTodos.some(
              successfulTodo => successfulTodo.id === todo.id,
            ),
        ),
      );

      if (failedTodos.length > 0) {
        setError('Unable to delete a todo');
      }
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      focusField();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosDb={todosDb}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputLoading={inputLoading}
          addTodo={addTodo}
        />

        <TodoList
          todosToShow={todosToShow}
          editIndex={editIndex}
          editValue={editValue}
          setEditValue={setEditValue}
          onDblClick={onDblClick}
          updateTodo={updateTodoFunc}
          deleteTodo={deleteTodoFunc}
          completeTodo={completeTodo}
          loadingTodoId={loadingTodoId}
          tempTodo={tempTodo}
        />
        {todosDb.length > 0 && (
          <Footer
            todosDb={todosDb}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};

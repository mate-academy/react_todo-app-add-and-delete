import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  getTodos,
  USER_ID,
  deleteTodo,
  //updateTodo,
} from './api/todos';
import { UserTodosList } from './UserTodosList';
import { Todo } from './types/Todo';
import { ErrorMessage } from './ErrorMessage';
import { Footer } from './Footer';

export type TodoInput = Omit<Todo, 'id'>;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: USER_ID,
    title: '',
    completed: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data ?? null);
      })
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('empty title');

      return;
    }

    setIsCreating(true);

    if (tempTodo !== null) {
      addTodos({ ...tempTodo, title: title.trim() })
        .then(newTodoFromAPI => {
          setTodos(prev =>
            prev ? [...prev, newTodoFromAPI] : [newTodoFromAPI],
          );
          setTempTodo({ id: 0, userId: USER_ID, title: '', completed: false });
          setTimeout(() => inputRef.current?.focus(), 0);
          setTitle('');
        })
        .catch(() => {
          setError('add');
          setTempTodo({ id: 0, userId: USER_ID, title: '', completed: false });
          setTimeout(() => inputRef.current?.focus(), 0);
        })
        .finally(() => {
          setIsCreating(false);
        });
    }
  };

  const handleFilter = (): Todo[] | null => {
    if (!todos) {
      return null;
    }

    if (filter === 'active') {
      return todos.filter(t => !t.completed);
    }

    if (filter === 'completed') {
      return todos.filter(t => t.completed);
    }

    return todos;
  };

  const delTodo = (todoId: number) => {
    setIsDeleting(true);
    deleteTodo(todoId)
      .then(() => {
        if (todos) {
          const updatedTodos = todos.filter(todo => todo.id !== todoId);

          setTodos(updatedTodos);
        }
      })
      .catch(() => setError('delete'))
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const deleteCompletedTodos = () => {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed === true);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const failedIds = completedTodos
          .filter((_, index) => results[index].status === 'rejected')
          .map(todo => todo.id);

        if (failedIds.length > 0) {
          setError('delete');
        }

        const updatedTodos = todos.filter(
          todo => !todo.completed || failedIds.includes(todo.id),
        );

        setTodos(updatedTodos);
      },
    );
  };
  /*

  const checkTodo = (todoId: number) => {
    const todoToUpdate = todos?.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const newCompletedStatus = !todoToUpdate.completed;

    updateTodo(todoId, { completed: newCompletedStatus });
    setShouldFetch(true);
  };

  const checkAllTodos = () => {
    if (!todos) {
      return;
    }

    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompleted;

    Promise.all(
      todos.map(todo =>
        updateTodo(todo.id, { completed: newCompletedStatus }).catch(() =>
          setError('update'),
        ),
      ),
    );

    setShouldFetch(true);
  };

  */

  const finalTodos: Todo[] | null = handleFilter();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            //onClick={() => checkAllTodos()}
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <UserTodosList
            todos={finalTodos}
            //onChecked={checkTodo}
            onDeleted={delTodo}
            isDeleting={isDeleting}
          />
          {isCreating && (
            <UserTodosList
              todos={[{ ...tempTodo, title: title }]}
              //onChecked={checkTodo}
              onDeleted={delTodo}
              isLoading={isCreating}
            />
          )}
        </section>

        {todos && todos.length > 0 && (
          <Footer
            filter={filter}
            filterTodos={todos}
            setFilter={setFilter}
            deleteCompleted={deleteCompletedTodos}
          />
        )}
      </div>
      <ErrorMessage error={error} onClear={clearError} />
    </div>
  );
};

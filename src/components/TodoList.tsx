import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import React, { useEffect, useState } from 'react';
import changeStatusCompleteTodo from '../service/changeStatus';
import { ErrorType } from '../enums/error';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  sortBy: string;
  tempTodo: Todo;
  pressButtonToggleAll: boolean;
  setHasError: React.Dispatch<React.SetStateAction<string>>;
  setPressButtonToggleAll: React.Dispatch<React.SetStateAction<boolean | null>>;
  loading: number[];
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  sortBy,
  tempTodo,
  pressButtonToggleAll,
  setPressButtonToggleAll,
  loading,
  setLoading,
  setHasError,
  setQuery,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTitle, setUpdateTitle] = useState<string>('');

  function filteredTodos(sortingBy: string): Todo[] {
    if (sortingBy === 'active') {
      return todos.filter(todo => !todo.completed);
    }

    if (sortingBy === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  const visibleTodos: Todo[] = filteredTodos(sortBy);

  const handleUpdateSubmit = e => {
    e.preventDefault();

    const currentTodo = todos.find(t => t.id === editingId);

    if (!currentTodo) {
      return;
    }

    if (updatedTitle.trim() === currentTodo.title) {
      setEditingId(null);

      return;
    }

    if (loading.includes(currentTodo.id)) {
      return;
    }

    if (updatedTitle.trim().length === 0) {
      setLoading(prev => [...prev, currentTodo.id]);

      deleteTodo(currentTodo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== currentTodo.id));
          setQuery('');
        })

        .catch((error: Error) => {
          setHasError(ErrorType.DELETE);

          throw error;
        })

        .finally(() => {
          setLoading(prev => prev.filter(id => id !== currentTodo.id));
        });

      return;
    }

    setLoading(prev => [...prev, currentTodo?.id]);

    updateTodo(editingId, { title: updatedTitle.trim() })
      .then((updated: Todo) => {
        setTodos(prev => prev.map(t => (t.id === editingId ? updated : t)));

        setEditingId(null);
      })
      .catch((error: Error) => {
        setHasError(ErrorType.UPDATE);
        throw error;
      })
      .finally(() => {
        setLoading(prev => prev.filter(id => id !== currentTodo.id));
      });
  };

  const handleUpdateBlur = () => {
    const currentTodo = todos.find(t => t.id === editingId);

    if (editingId === currentTodo.id) {
      handleUpdateSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    }
  }

  useEffect(() => {
    if (pressButtonToggleAll === null) {
      return;
    }

    const oneStatusTodo = visibleTodos.filter(
      (todo: Todo) => todo.completed !== pressButtonToggleAll,
    );

    oneStatusTodo.map((todo: Todo) =>
      changeStatusCompleteTodo({ todo, setTodos, setLoading, setHasError }),
    );

    setPressButtonToggleAll(null);
  }, [
    pressButtonToggleAll,
    setHasError,
    setLoading,
    setPressButtonToggleAll,
    setTodos,
    visibleTodos,
  ]);

  const handleEsc = e => {
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={`todo item-enter-done ${todo.completed ? 'completed' : ''}`}
          >
            <label className="todo__status-label">
              <input
                aria-label="status"
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() =>
                  changeStatusCompleteTodo({
                    todo,
                    setTodos,
                    setLoading,
                    setHasError,
                  })
                }
              />
            </label>

            {editingId !== todo.id ? (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingId(todo.id);
                    setUpdateTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    setLoading(prev => [...prev, todo.id]);

                    deleteTodo(todo.id)
                      .then(() => {
                        setTodos(current =>
                          current.filter(t => t.id !== todo.id),
                        );
                        setQuery('');
                      })

                      .catch((error: Error) => {
                        setHasError(ErrorType.DELETE);

                        throw error;
                      })

                      .finally(() => {
                        setLoading(prev => prev.filter(id => id !== todo.id));
                      });
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdateSubmit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  autoFocus={true}
                  onKeyDown={handleEsc}
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={updatedTitle}
                  onBlur={handleUpdateBlur}
                  onChange={e => setUpdateTitle(e.target.value)}
                />
              </form>
            )}
            <div
              data-cy="TodoLoader"
              className={`modal overlay ${loading.includes(todo.id) ? 'is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              aria-label="status"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TodoList;

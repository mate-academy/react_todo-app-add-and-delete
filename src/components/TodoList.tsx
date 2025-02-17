import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  updateTodos: (todoItems: Todo[]) => void;
  tempTodo: Todo | null;
  filterOption: FilterOptions;
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
  clearTimeoutError: () => void;
  isCompletedTodosDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodos,
  tempTodo,
  filterOption,
  errorText,
  addErrorText,
  clearTimeoutError,
  isCompletedTodosDeleting,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoQuery, setEditingTodoQuery] = useState<string>('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const editingTodoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTodoField.current && editingTodoId) {
      editingTodoField.current.focus();
    }
  }, [editingTodoId]);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterOption),
    [todos, filterOption],
  );

  const handleCheckboxChange = useCallback(
    (todoId: number, completed: boolean): void => {
      const newTodos = [...todos];
      const index = newTodos.findIndex(todoItem => todoItem.id === todoId);

      newTodos[index].completed = !completed;

      updateTodos(newTodos);
    },
    [todos, updateTodos],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number): void => {
      if (errorText) {
        addErrorText(null);
      }

      setDeletingTodoId(todoId);

      deleteTodo(todoId)
        .then(() => {
          updateTodos(todos.filter(todoItem => todoItem.id !== todoId));
        })
        .catch(() => {
          addErrorText(Errors.unableToDelete);
          clearTimeoutError();
        })
        .finally(() => setDeletingTodoId(null));
    },
    [todos, updateTodos, errorText, addErrorText, clearTimeoutError],
  );

  const handleRenameTodo = useCallback(
    (todoId: number, newTodoTitle: string): void => {
      const newTodos = [...todos];
      const index = newTodos.findIndex(todoItem => todoItem.id === todoId);

      newTodos[index].title = newTodoTitle;

      updateTodos(newTodos);
    },
    [todos, updateTodos],
  );

  const startEditTodo = useCallback(
    (todoId: number, todoTitle: string): void => {
      setEditingTodoId(todoId);
      setEditingTodoQuery(todoTitle);
    },
    [],
  );

  const endEditTodo = useCallback((): void => {
    setEditingTodoId(null);
    setEditingTodoQuery('');
  }, []);

  const editTodo = useCallback(
    (todoId: number, todoTitle: string): void => {
      if (!editingTodoQuery.trim()) {
        handleDeleteTodo(todoId);
      } else if (editingTodoQuery.trim() !== todoTitle) {
        handleRenameTodo(todoId, editingTodoQuery.trim());
      }

      endEditTodo();
    },
    [editingTodoQuery, handleDeleteTodo, handleRenameTodo, endEditTodo],
  );

  const handleOnChangeEditingTodo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEditingTodoQuery(event.target.value);
    },
    [],
  );

  const handleOnKeyUpEditingTodo = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Escape') {
        endEditTodo();
      }
    },
    [endEditTodo],
  );

  const handleSubmitEditingTodo = useCallback(
    (
      event: React.FormEvent<HTMLFormElement>,
      todoId: number,
      todoTitle: string,
    ): void => {
      event.preventDefault();

      editTodo(todoId, todoTitle);
    },
    [editTodo],
  );

  const handleOnBlurEditingTodo = useCallback(
    (todoId: number, todoTitle: string): void => {
      editTodo(todoId, todoTitle);
    },
    [editTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => handleCheckboxChange(id, completed)}
              />
            </label>

            {editingTodoId === id ? (
              <form
                onSubmit={event => handleSubmitEditingTodo(event, id, title)}
              >
                <input
                  ref={editingTodoField}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={editingTodoQuery}
                  onChange={handleOnChangeEditingTodo}
                  onKeyUp={handleOnKeyUpEditingTodo}
                  onBlur={() => handleOnBlurEditingTodo(id, title)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => startEditTodo(id, title)}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active':
                  deletingTodoId === id ||
                  (isCompletedTodosDeleting && completed),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {!!tempTodo && (
        <>
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                disabled
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

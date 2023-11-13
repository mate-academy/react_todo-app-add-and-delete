import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { AppContext, AppContextType } from '../Contexts/AppContextProvider';
import { client } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  tempIsLoading?: boolean;
};

const TodoItem: React.FC<Props> = ({ todo, tempIsLoading }) => {
  const {
    todos, setTodos, setErrorMessage, inputRef,
  } = useContext(
    AppContext,
  ) as AppContextType;

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editQuery, setEditQuery] = useState(todo.title);

  const todoElemRef = useRef<HTMLDivElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [isEditing]);

  const filterById = useCallback(
    (prevTodo: Todo) => prevTodo.id !== todo.id,
    [todo.id],
  );

  const sortById = (a: Todo, b: Todo) => a.id - b.id;

  const deleteTodo = useCallback(async () => {
    try {
      setIsUpdating(true);

      setTodos((prevTodos) => {
        return [...prevTodos.filter(filterById), todo].sort(sortById);
      });

      await client.delete(`/todos/${todo.id}`);

      setTodos((prevTodos) => {
        return [...prevTodos.filter(filterById)];
      });
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTodos(todos);
    } finally {
      setIsUpdating(false);
    }
  }, [filterById, setErrorMessage, setTodos, todo, todos]);

  const toggleTodo = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedTodo: Todo = {
        ...todo,
        completed: e.target.checked,
      };

      try {
        setIsUpdating(true);

        const respone = await client.patch<Todo>(`/todos/${updatedTodo.id}`, updatedTodo);

        setTodos((prevTodos) => {
          const restTodos = prevTodos.filter(filterById);

          return [...restTodos, respone].sort(sortById);
        });
      } catch {
        setErrorMessage('Unable to update a todo');
        setTodos(todos);
      } finally {
        setIsUpdating(false);
      }
    },
    [filterById, setErrorMessage, setTodos, todo, todos],
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setIsUpdating(false);

    setEditQuery(todo.title);
  }, [todo.title]);

  const editTodo = useCallback(async () => {
    const trimmedQuery = editQuery.trim();

    if (trimmedQuery === todo.title) {
      cancelEdit();

      return;
    }

    if (!trimmedQuery.length) {
      deleteTodo();

      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: trimmedQuery,
      completed: false,
    };

    try {
      setIsUpdating(true);

      const response = await client.patch<Todo>(`/todos/${updatedTodo.id}`, updatedTodo);

      setIsEditing(false);

      setTodos((prevTodos) => {
        const restTodos = prevTodos.filter(filterById);

        return [...restTodos, response].sort(sortById);
      });
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsUpdating(false);
    }
  }, [
    cancelEdit,
    deleteTodo,
    editQuery,
    filterById,
    setErrorMessage,
    setTodos,
    todo,
  ]);

  const onSubmitEditedTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      editTodo();
    },
    [editTodo],
  );

  const onEscape = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (e.key === 'Escape') {
        cancelEdit();
      }
    },
    [cancelEdit],
  );

  const onBlur = useCallback(() => {
    editTodo();
  }, [editTodo]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, todos]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      ref={todoElemRef}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {isEditing ? (
        <form ref={editFormRef} onSubmit={(e) => onSubmitEditedTodo(e)}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editQuery}
            onChange={(e) => setEditQuery(e.target.value)}
            onKeyUp={onEscape}
            onBlur={onBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            &times;
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating || tempIsLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export { TodoItem };

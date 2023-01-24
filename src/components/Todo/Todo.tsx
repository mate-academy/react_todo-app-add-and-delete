import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { deleteTodo } from '../../api/todos';
import { Error } from '../../types';
import { ITodo } from '../../types/ITodo';
import { AppContext } from '../AppProvider/AppProvider';

type Props = {
  todo: ITodo
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    setError,
    setTodos,
    todos,
    isLoadingMany,
    isDeleting,
  } = useContext(AppContext);

  const titleField = useRef<HTMLInputElement>(null);

  const areAllChecked = todos.every(({ completed }) => completed);
  const shouldLoad = !todo.completed || areAllChecked;

  const isActive = isLoading
    || todo.id === 0 // temp todo
    || (isLoadingMany && shouldLoad)
    || (isDeleting && todo.completed);

  useEffect(() => {
    titleField.current?.focus();
  }, [isEditing]);

  const onDelete = async () => {
    setIsLoading(true);
    const filteredTodos = todos.filter(({ id }) => id !== todo.id);

    try {
      await deleteTodo(todo.id);
      setTodos(filteredTodos);
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!todo.title) {
      onDelete();
    }
  }, []);

  const updateTodo = (newProps: Partial<ITodo>) => {
    setTodos(current => current.map(mappedTodo => (
      mappedTodo.id === todo.id
        ? { ...mappedTodo, ...newProps }
        : mappedTodo
    )));
  };

  // PATCH todo.completed
  const onCheck = () => {
    const newProps = { completed: !todo.completed };

    setIsLoading(true);
    setTimeout(updateTodo, 800, newProps);
    setTimeout(setIsLoading, 800, false);
  };

  // PATCH todo.title
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo({ title });
    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={onCheck}
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={onSubmit}
            onBlur={() => setIsEditing(false)}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              ref={titleField}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        )
        : (
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
              data-cy="TodoDeleteButton"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

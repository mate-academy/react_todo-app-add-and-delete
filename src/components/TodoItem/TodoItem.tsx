import cn from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../../context/TodosContext';

type Props = {
  todo: Todo;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, loading = false }) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const {
    setTodos,
    setError,
    setErrorTimeout,
    processingTodos,
  } = useContext(TodosContext);

  const editingInput = useRef<HTMLInputElement>(null);

  const checkedChangeHandler = () => {
    setIsLoading(true);

    updateTodo({ id: todo.id, completed: !todo.completed })
      .then((updatedTodo) => {
        setTodos(todos => {
          const newTodos = [...todos];

          newTodos.splice(newTodos.indexOf(todo), 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setIsLoading(false);
        setError({ message: 'Failed to update todo', isError: true });
        setErrorTimeout();
      })
      .finally(() => setIsLoading(false));
  };

  const deleteButtonClickHandler = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos => {
          const newTodos = [...todos];

          newTodos.splice(newTodos.indexOf(todo), 1);

          return newTodos;
        });
      })
      .catch(() => {
        setError({ message: 'Failed to delete todo', isError: true });
        setErrorTimeout();
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isUpdating) {
      editingInput.current?.focus();
    }
  }, [isUpdating]);

  const editKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      editingInput.current?.blur();
    }

    if (event.key === 'Escape') {
      setIsUpdating(false);
      setNewTodoTitle(todo.title);
    }
  };

  const editBlurHandler = () => {
    if (newTodoTitle.trim() === '') {
      deleteButtonClickHandler();

      return;
    }

    setIsLoading(true);

    updateTodo({
      id: todo.id,
      title: newTodoTitle.trim(),
    })
      .then((updatedTodo) => {
        setTodos(todos => {
          const newTodos = [...todos];

          newTodos.splice(newTodos.indexOf(todo), 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setError({ message: 'Failed to update todo', isError: true });
        setErrorTimeout();
      })
      .finally(() => {
        setIsLoading(false);
        setIsUpdating(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={checkedChangeHandler}
        />
      </label>

      {!isUpdating
        ? (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsUpdating(true)}
          >
            {todo.title}
          </span>
        )
        : (
          <form>
            <input
              ref={editingInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onKeyDown={editKeyDownHandler}
              onBlur={editBlurHandler}
            />
          </form>
        )}

      {(isHovered && !isUpdating) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={deleteButtonClickHandler}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay',
          { 'is-active': isLoading || processingTodos.includes(todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

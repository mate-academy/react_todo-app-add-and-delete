import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  // getTodos
} from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  todos: Todo[];
  nowLoading: boolean;
  showErrorWithDelay: (errorMessage: string) => void;
  handleCompleted: (elem: number, completed: boolean) => void;
  // USER_ID: 11719;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setLoaded,
  todos,
  nowLoading,
  showErrorWithDelay,
  handleCompleted,
  // USER_ID,
}) => {
  const [changedElement, setChangedElement] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deleteId, setDeleteId] = useState(0);
  const handleTodoChange = () => {
    showErrorWithDelay('Unable to update a todo');
  };

  const loseFocus = () => {
    setIsEditing(false);
    setFocus(false);
    setEditId(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyDown = event.key;

    if (keyDown === 'Enter') {
      handleTodoChange();
      loseFocus();
    }

    if (keyDown === 'Escape') {
      loseFocus();
    }
  };

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  const handleDoubleClick = useCallback((elem: Todo) => {
    const selectedTodo = todos.find(item => item.id === elem.id);

    if (selectedTodo && selectedTodo.title) {
      setChangedElement(selectedTodo.title);
      if (elem.id) {
        setEditId(elem.id);
      }
    }

    setIsEditing(true);
    setFocus(true);
  }, [todos, setChangedElement, setEditId, setIsEditing, setFocus]);

  const handleOnBlur = () => {
    handleTodoChange();
    setIsEditing(false);
    setFocus(false);
    setEditId(null);
  };

  const TodoDeleteButton = (id: number) => {
    setDeleteId(id);
    deleteTodo(id)
      .then(() => {
        setLoaded(true);
        const updatedTodos = todos.filter(elem => elem.id !== id);

        setTodos(updatedTodos);
      })
      .catch((fetchError) => {
        setLoaded(false);
        setDeleteId(0);
        showErrorWithDelay('Unable to delete a todo');
        throw fetchError;
      });
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleCompleted(todo.id, todo.completed)}
        />
      </label>
      {editId === todo.id && isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedElement || ''}
            onChange={(event) => {
              setChangedElement(event.target.value);
            }}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => TodoDeleteButton(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': (todo.id === 0 && nowLoading)
          || (deleteId === todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

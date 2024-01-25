import classNames from 'classnames';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodoContext';

type Props = {
  todo: Todo;
};

export const TodoTitleField:React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;

  const {
    filteredTodos,
    updateChecked,
    TodoDeleteButton,
  } = useContext(TodosContext);

  const [changedTodo, setChangedTodo] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);
  const todoFocus = useRef<HTMLInputElement>(null);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTodo(event.target.value);
  };

  const handleDoubleClick = useCallback((el: Todo) => {
    setIsEditing(true);
    setFocus(true);
    const selectedTodo = filteredTodos.find(item => item.id === el.id);

    if (selectedTodo) {
      setChangedTodo(selectedTodo.title);
    }
  }, [filteredTodos, setIsEditing]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const clickEnterOrEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (changedTodo.trim() === '') {
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }

    setFocus(false);
  };

  const handleBlur = () => {
    handleSave();
    setIsEditing(false);
    setFocus(false);
  };

  useEffect(() => {
    if (todoFocus.current && focus) {
      todoFocus.current.focus();
    }
  }, [isEditing, focus]);

  return (
    <>
      <div
        key={id}
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed },
        )}
      >
        {!isEditing
          ? (
            <>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onClick={() => updateChecked(todo)}
                />
              </label>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo)}
              >
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => TodoDeleteButton(todo.id)}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={
                  classNames('modal overlay',
                    { 'is-active': todo.id === 0 })
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          )
          : (
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder={title || 'Empty todo will be deleted'}
              ref={todoFocus}
              onKeyUp={clickEnterOrEsc}
              value={changedTodo}
              onChange={handleTitle}
              onBlur={handleBlur}
            />
          )}
      </div>
    </>
  );
};

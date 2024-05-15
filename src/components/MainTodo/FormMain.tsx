/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { deleteTodo, updateTodo } from '../../api/todos';

interface IProps {
  id: string;
  title: string;
  setEditableTodoId: () => void;
  showError: (err: string) => void;
}

export const FormMain: FC<IProps> = ({
  id,
  title,
  setEditableTodoId,
  showError,
}) => {
  const { handleFocusInput } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);
  const [editText, setEditText] = useState(title);

  const editFormRef = useRef<HTMLFormElement>(null);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'CANCEL_TODO' });
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent | MouseEvent) => {
      e.preventDefault();

      if (!editText.trim()) {
        if (id) {
          try {
            await deleteTodo(id);
            dispatch({ type: 'DELETE_TODO', payload: id });
            handleFocusInput();
          } catch (error) {
            showError('Title should not be empty');
          }
        }
      } else {
        const newTodo = {
          id: id,
          title: editText.trim(),
          completed: false,
        };

        try {
          const updatedTodo = await updateTodo(newTodo);

          dispatch({ type: 'EDIT_TODO', payload: updatedTodo });
        } catch (error) {
          showError('Unable to update a todo');
        }

        cancelEdit();
        handleFocusInput();
      }

      setEditableTodoId();
    },
    [
      editText,
      setEditableTodoId,
      id,
      dispatch,
      handleFocusInput,
      showError,
      cancelEdit,
    ],
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        editFormRef.current &&
        !editFormRef.current.contains(e.target as Node)
      ) {
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditableTodoId();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => handleClickOutside(e);

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleClickOutside]);

  return (
    <form ref={editFormRef} onSubmit={e => handleSubmit(e)}>
      <label htmlFor="TodoTitleField">
        <input
          id="TodoTitleField"
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleKeyUp}
          onBlur={handleSubmit}
          autoFocus
        />
      </label>
    </form>
  );
};

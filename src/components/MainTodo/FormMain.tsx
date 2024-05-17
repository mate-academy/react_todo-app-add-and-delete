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
  setLoading: (bool: boolean) => void;
}

export const FormMain: FC<IProps> = ({
  id,
  title,
  setEditableTodoId,
  showError,
  setLoading,
}) => {
  const { handleFocusInput } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);
  const [editText, setEditText] = useState(title);

  const editFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent | MouseEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (!editText.trim()) {
          if (id) {
            await deleteTodo(id);
            dispatch({ type: 'DELETE_TODO', payload: id });
            handleFocusInput();
          }
        } else {
          const newTodo = {
            id: id,
            title: editText.trim(),
            completed: false,
          };
          const updatedTodo = await updateTodo(newTodo);

          dispatch({ type: 'EDIT_TODO', payload: updatedTodo });
          handleFocusInput();
        }
      } catch (error) {
        showError('Unable to update or delete the todo');
      } finally {
        setLoading(false);
        setEditableTodoId();
      }
    },
    [
      editText,
      id,
      dispatch,
      handleFocusInput,
      showError,
      setEditableTodoId,
      setLoading,
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

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditableTodoId();
      }
    },
    [setEditableTodoId],
  );

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

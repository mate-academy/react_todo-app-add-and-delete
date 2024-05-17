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
import { TodoDispatch } from '../../../Context/TodoContext';
import { deleteTodo, updateTodo } from '../../../api/todos';

interface IProps {
  id: string;
  title: string;
  editableTodoId: string;
  setEditableTodoId: () => void;
  showError: (err: string) => void;
  setEditableLoad: (bool: boolean) => void;
}

export const FormMain: FC<IProps> = ({
  id,
  title,
  editableTodoId,
  setEditableTodoId,
  showError,
  setEditableLoad,
}) => {
  const dispatch = useContext(TodoDispatch);
  const [editText, setEditText] = useState(title);
  const inputFocus = useRef<HTMLInputElement | null>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const handleFocusInput = () => {
    inputFocus.current?.focus();
  };

  useEffect(() => {
    if (editableTodoId === id) {
      handleFocusInput();
    }
  }, [editableTodoId, id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent | MouseEvent) => {
      e.preventDefault();

      try {
        setEditableLoad(true);
        if (!editText.trim()) {
          if (id) {
            await deleteTodo(id);
            dispatch({ type: 'DELETE_TODO', payload: id });
          }
        } else if (editText.trim() !== title) {
          const newTodo = {
            id: id,
            title: editText.trim(),
            completed: false,
          };
          const updatedTodo = await updateTodo(newTodo);

          dispatch({ type: 'EDIT_TODO', payload: updatedTodo });
        }

        setEditableTodoId();
      } catch (error) {
        if (!editText.trim()) {
          showError('Unable to delete a todo');
        } else {
          showError('Unable to update a todo');
        }

        handleFocusInput();
      } finally {
        setEditableLoad(false);
      }
    },
    [
      setEditableLoad,
      editText,
      title,
      id,
      dispatch,
      showError,
      setEditableTodoId,
    ],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditableTodoId();
      }
    },
    [setEditableTodoId],
  );

  return (
    <form ref={editFormRef} onSubmit={e => handleSubmit(e)}>
      <label htmlFor="TodoTitleField">
        <input
          ref={inputFocus}
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

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DispatchContext } from '../../store/Store';
import { USER_ID, createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  isDeleting: boolean;
};

export const Header: React.FC<Props> = ({ setTempTodo, isDeleting }) => {
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useContext(DispatchContext);
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabledInput, isDeleting]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim().length) {
      dispatch({
        type: 'SHOW_ERROR_MESSAGE',
        payload: { message: 'Title should not be empty' },
      });

      return;
    }

    setDisabledInput(true);
    setTempTodo({ id: 0, userId: USER_ID, title: value, completed: false });
    createTodo({ title: value })
      .then(() => {
        dispatch({ type: 'ADD_NEW_TODO', payload: { title: value } });
        setDisabledInput(false);
        setValue('');
      })
      .catch(() => {
        setDisabledInput(false);
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to add a todo' },
        });
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={value}
          disabled={disabledInput}
          onChange={e => setValue(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

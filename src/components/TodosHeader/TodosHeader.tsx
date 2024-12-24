import {
  FC,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  FormEvent,
} from 'react';
import { trimString } from '../../utils/trimString';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  addNewTodoHandler: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | null>>;
  isTempTodo: boolean;
  todosLength: number;
};

export const TodosHeader: FC<Props> = props => {
  const { addNewTodoHandler, setErrorMessage, todosLength, isTempTodo } = props;

  const [inputValue, setInputValue] = useState('');
  const inputTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [isTempTodo, todosLength]);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!trimString(inputValue)) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      setInputValue('');

      return;
    }

    try {
      await addNewTodoHandler(trimString(inputValue));
      setInputValue('');
    } catch (err) {
      throw err;
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={evt => setInputValue(evt.target.value)}
          ref={inputTitleRef}
          disabled={isTempTodo}
        />
      </form>
    </header>
  );
};

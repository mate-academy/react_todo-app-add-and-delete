import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  callError: () => void;
  errorMessage: (message: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  callError,
  errorMessage,
  setTempTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const { todos, setTodos } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const setInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    if (newTodoTitle.trim().length) {
      e.preventDefault();
      setInputDisabled(true);
      setTempTodo({
        title: newTodoTitle,
        id: 0,
        userId: 163,
        completed: false,
      });

      addTodo(newTodoTitle)
        .then(response => {
          setTodos([...todos, response]);
          setNewTodoTitle('');
        })
        .catch(() => {
          errorMessage('Unable to add a todo');
          callError();
        })
        .finally(() => {
          setInputDisabled(false);
          setTempTodo(null);
          setInputFocus();
        });
    } else {
      e.preventDefault();
      errorMessage('Title should not be empty');
      callError();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          id="todoInput"
          value={newTodoTitle}
          onChange={handleOnChange}
          // onKeyDown={handleAddTodo}
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          disabled={inputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

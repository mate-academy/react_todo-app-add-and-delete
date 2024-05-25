import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { addTodos } from '../api/todos';

type Props = {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  handleErrorMessages: (newErrorMessage: string) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  handleErrorMessages,
  setTempTodo,
}) => {
  const [query, setQuery] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);
  const handleFocusInput = () => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      handleErrorMessages('Title should not be empty');

      return;
    }

    const newTodo = {
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    try {
      setDisableInput(true);

      const tempTodo = {
        title: query,
        completed: false,
        id: 0,
        userId: USER_ID,
      };

      setTempTodo(tempTodo);
      const responseTodo = await addTodos(newTodo);

      addTodo(responseTodo);
      handleFocusInput();
      setQuery('');
    } catch {
      handleErrorMessages('Unable to add a todo');
    } finally {
      setDisableInput(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    handleFocusInput();
  }, [handleFocusInput]);

  return (
    <header className="todoapp__header">
      <Button
        type="button"
        className={
          todos.every(todo => todo?.completed === true)
            ? 'todoapp__toggle-all active'
            : ' todoapp__toggle-all'
        }
        dataCy="ToggleAllButton"
        onClick={() => {} /*completeToggle()*/}
      />
      <form onSubmit={e => handleSubmitForm(e)}>
        <input
          disabled={disableInput}
          ref={inputElement}
          value={query}
          onChange={e => setQuery(e.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { USER_ID } from '../../api/todos';

type Props = {
  titleValue: string;
  setTitle: (title: string) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (message: string) => void;
};

export const Header: React.FC<Props> = ({
  titleValue,
  setTitle,
  setTodos,
  setTempTodo,
  setErrorMessage,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputField.current?.focus();
  });

  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTitle = titleValue.trim();

    if (newTitle === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const todoStub = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo({ ...todoStub, id: 0 });

    setIsInputDisabled(true);

    client
      .post<Todo>('/todos', todoStub)
      .then(newTodo => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
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
      <form onSubmit={handleSubmit}>
        <input
          value={titleValue}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

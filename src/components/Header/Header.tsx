/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';
import { addTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    handleErrorMessage,
    setTempTodo,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  inputRef.current?.focus();

  const createNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    addTodo(newTodo)
      .then(returnedTodo => {
        setTodos([...todos, returnedTodo]);
        setTitle('');
      })
      .catch(() => {
        handleErrorMessage(ErrorMessage.UNABLE_ADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={createNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};

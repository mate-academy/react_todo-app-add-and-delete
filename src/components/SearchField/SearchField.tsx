import {
  FC,
  useContext,
  useEffect,
} from 'react';
import cn from 'classnames';
import { addTodo } from '../../api/todos';
import { USER_ID } from '../../utils/constants';
import { Todo } from '../../types/Todo';
import { waitToClose } from '../../utils/hideErrorWithDelay';
import { ErrorProvider } from '../../context/TodoError';
import { LoaddingProvider } from '../../context/Loading';

type TSearchFieldProps = {
  hasTodos: boolean;
  searchValue: string;
  inputFieldRef: { current: HTMLInputElement | null }
  allTodoCompleted: boolean;
  hasAddTodoErrorTimerId: { current: number }
  setTodos: (newTodo: ((prev: Todo[]) => Todo[])) => void
  setTempTodo: (newTodo: Todo | null) => void
  setSearchValue: (newValue: string) => void;
};

export const SearchField: FC<TSearchFieldProps> = ({
  setSearchValue,
  searchValue,
  allTodoCompleted,
  hasTodos,
  setTodos,
  inputFieldRef,
  setTempTodo,
  hasAddTodoErrorTimerId,
}) => {
  const { setError } = useContext(ErrorProvider);
  const { isLoading, setIsLoading } = useContext(LoaddingProvider);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidSearchValue = !searchValue || searchValue.trim() === '';

    if (isValidSearchValue) {
      setError(prev => ({
        ...prev,
        message: 'Title should not be empty',
        hasError: true,
      }));

      // eslint-disable-next-line no-param-reassign
      hasAddTodoErrorTimerId.current = waitToClose(3000, setError);

      return;
    }

    (async () => {
      const newTodo = {
        title: searchValue.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        setIsLoading(true);

        const todoFromServer = await addTodo(newTodo);

        setIsLoading(false);
        setSearchValue('');
        setTempTodo(null);
        setTodos((prevTodos) => [...prevTodos, todoFromServer]);
      } catch (errorSubmit) {
        // eslint-disable-next-line no-console
        console.warn(errorSubmit);
        setIsLoading(false);
        setTempTodo(null);

        setError(prev => ({
          ...prev,
          hasError: true,
          message: 'Unable to add a todo',
        }));

        // eslint-disable-next-line no-param-reassign
        hasAddTodoErrorTimerId.current = waitToClose(3000, setError);
      }
    })();
  };

  const handleSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggle button"
        />
      )}

      <form
        onSubmit={handleSubmitForm}
      >
        <input
          ref={inputFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchValue}
          onChange={handleSearchValue}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { USER_ID, createTodos, updateTodos } from '../api/todos';
import { ErrorTypes } from '../types/enums';
import { handleError } from '../utils/services';

type Props = {
  todos: Todo[];
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  todos,
  isFocused,
  setIsFocused,
  setTodos,
  setErrorMessage,
  setIsLoading,
  setTempTodo,
  tempTodo,
}) => {
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const normalisedTitle = title.trim();

  const isSomeTodoCompleted = useMemo(
    () => todos.some(todo => !todo.completed),
    [todos],
  );

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);

  const onPatch = (todo: Todo) => {
    setIsLoading(prev => [...prev, todo.id]);

    updateTodos(todo.id, todo)
      .catch(() => handleError(ErrorTypes.OnUpdErr, setErrorMessage))
      .finally(() => {
        setIsLoading(prev => prev.filter(item => item !== todo.id));
      });
  };

  const onButtonClick = () => {
    setTodos(prev =>
      prev.map(todo => ({ ...todo, completed: isSomeTodoCompleted })),
    );
    todos.map(todo =>
      todo.completed !== isSomeTodoCompleted
        ? onPatch({ ...todo, completed: isSomeTodoCompleted })
        : todo,
    );
  };

  const onSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!normalisedTitle) {
      handleError(ErrorTypes.OnEmptyTitleErr, setErrorMessage);
    } else {
      const tempTodoId = tempTodo
        ? tempTodo.id + 1
        : Math.floor(Math.random() * 100);

      setTempTodo({
        id: tempTodoId,
        userId: USER_ID,
        title: normalisedTitle,
        completed: false,
      });
      setIsLoading(prev => [...prev, tempTodoId]);

      setIsFocused(false);
      setIsInputDisabled(true);

      createTodos({ userId: USER_ID, completed: false, title: normalisedTitle })
        .then(resp => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, resp]);
          setIsFocused(true);
          setTempTodo(null);
          setIsLoading(prev =>
            prev.filter(id => todos.filter(todo => id === todo.id)),
          );
          setIsInputDisabled(false);
          setTitle('');
        })
        .catch(() => {
          setTempTodo(null);
          setIsInputDisabled(false);
          setIsFocused(true);
          handleError(ErrorTypes.OnAddErr, setErrorMessage);
        })
        .finally(() => setTempTodo(null));
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !isSomeTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onButtonClick()}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          disabled={isInputDisabled}
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      </form>
    </header>
  );
};

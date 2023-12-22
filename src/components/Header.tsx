import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorContext, ErrorsMessageContext } from './ErrorsContext';
import { addTodo } from '../api/todos';
import { IsfinallyContext, TempTodoContext } from './TempTodoContext';

type Props = {
  todos: Todo[];
};
export const Header: React.FC<Props> = ({ todos }) => {
  const { setErrorsMesage } = useContext(ErrorsMessageContext);
  const [value, setValue] = useState('');
  const { setIsError } = useContext(ErrorContext);
  const { isfinally, setIsfinally } = useContext(IsfinallyContext);
  const { setTempTodo } = useContext(TempTodoContext);
  const headerInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (headerInput.current) {
      headerInput.current.focus();
    }
  }, [isfinally]);
  const SubmitAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsfinally(true);
    const trimValue = value.trim();

    if (trimValue.length <= 0) {
      setIsError(true);
      setErrorsMesage('empty');
      setValue('');

      return;
    }

    setTempTodo(trimValue);
    addTodo(11969, trimValue)
      .finally(() => {
        setIsfinally(false);
        setTempTodo(null);
        setValue('');
      })
      .catch(() => {
        setIsError(true);
        setErrorsMesage('add');
      });
  };

  return (
    <header
      className="todoapp__header"
    >
      {!!todos?.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all ', {
            active: !todos.some((el) => el.completed === false),
          })}
          data-cy="ToggleAllButton"
        />
      ) }
      <form
        onSubmit={SubmitAddTodo}
      >
        <input
          ref={headerInput}
          disabled={isfinally}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onMouseDown={() => {
            setIsError(false);
          }}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </header>
  );
};

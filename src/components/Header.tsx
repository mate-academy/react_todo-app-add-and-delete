/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from 'react';
import classNames from 'classnames';

import { CustomError } from '../types/CustomError';
import { NewTodo, Todo } from '../types/Todo';
import { postTodo } from '../api/todos';
import { initData } from '../constants/initData';

type Props = {
  tempTodo: Todo | null,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  activeLeft: number,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const Header: FC<Props> = ({
  tempTodo,
  setTodos,
  activeLeft,
  setTempTodo,
  setError,
}) => {
  const [newTodo, setNewTodo] = useState<NewTodo>(initData.newTodo);
  const [inputDisabled, setInputDisabled] = useState(false);

  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusInput.current) {
      focusInput.current.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.title.length) {
      setError(CustomError.EmptyTitle, 3000);
    } else {
      setInputDisabled(true);
      setTempTodo({ ...newTodo, id: 0 });

      postTodo(newTodo)
        .then((response) => {
          setTodos((prevTodos) => {
            return [...prevTodos, response];
          });
          setTempTodo(null);
          setNewTodo(initData.newTodo);
          setInputDisabled(false);
        })
        .catch(() => setError(CustomError.Add, 3000));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeLeft },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={focusInput}
          disabled={inputDisabled}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo.title}
          onChange={handleInputChange}
        />
      </form>
    </header>

  );
};

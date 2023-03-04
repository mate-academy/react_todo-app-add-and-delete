/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';

import { ActiveTodoData } from '../types/ActiveTodoData';
import { CustomError } from '../types/CustomError';
import { NewTodo, Todo } from '../types/Todo';
import { postTodo } from '../api/todos';
import { initData } from '../constants/initData';

type Props = {
  tempTodo: Todo | null,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  activeTodoData: ActiveTodoData,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const Header: FC<Props> = ({
  tempTodo,
  setTodos,
  activeTodoData,
  setTempTodo,
  setError,
}) => {
  const [newTodo, setNewTodo] = useState<NewTodo>(initData.newTodo);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput.current) {
      focusInput.current.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.title.length) {
      setError(CustomError.emptyTitle, 3000);
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
        .catch(() => setError(CustomError.add, 3000));
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeTodoData.hasActiveTodo },
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
          onChange={(e) => setNewTodo((prevState) => {
            return { ...prevState, title: e.target.value };
          })}
        />
      </form>
    </header>

  );
};

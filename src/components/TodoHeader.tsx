import classNames from 'classnames';
import {
  FC, FormEvent, useEffect, useRef, useState,
} from 'react';
import { addTodo } from '../api/todos';
import { USER_ID } from '../constants/userId';
import { useDispatch, useSelector } from '../providers/TodosContext';

type Props = {
  isSomeActive: boolean
};

export const TodoHeader: FC<Props> = ({ isSomeActive }) => {
  const { todos, updateTodos } = useSelector();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setInputValue('');
      dispatch({
        type: 'setError',
        payload: {
          isError: true,
          errorMessage: 'Title should not be empty',
        },
      });

      return;
    }

    setIsLoading(true);
    dispatch({
      type: 'setTempTodo',
      payload: {
        id: 0,
        title: inputValue.trim(),
        userId: USER_ID,
        completed: false,
      },
    });

    addTodo({
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then((newTodo) => {
        setInputValue('');
        dispatch({ type: 'setTodos', payload: [...todos, newTodo] });
        updateTodos();
      })
      .catch(() => dispatch({
        type: 'setError',
        payload: {
          isError: true,
          errorMessage: 'Unable to add a todo',
        },
      }))
      .finally(() => {
        setIsLoading(false);
        dispatch({
          type: 'setTempTodo',
          payload: null,
        });
        inputRef.current?.focus();
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !isSomeActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

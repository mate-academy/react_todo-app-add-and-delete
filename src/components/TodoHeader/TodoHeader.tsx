import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoContext, USER_ID } from '../../context/TodoContext';
import { ErrorEnum } from '../../types/Error';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoHeader: React.FC = () => {
  const {
    visibleTodos,
    activeTodosAmount,
    setTodos,
    setError,
    setTempTodo,
  } = useContext(TodoContext);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTempTodo({
      title: value,
      id: 0,
      completed: false,
      userId: USER_ID,
    });

    if (value.trim()) {
      setIsLoading(true);
      addTodo(value.trim(), USER_ID)
        .then((data: Todo) => {
          setTodos((prev) => [...prev, data]);
          setValue('');
        })
        .catch(() => {
          setError(ErrorEnum.addError);
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    } else {
      setError(ErrorEnum.titleNotEmpty);
    }
  };

  return (
    <header className="todoapp__header">
      {visibleTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosAmount === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          value={value}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

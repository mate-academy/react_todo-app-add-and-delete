import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import * as todoService from '../../api/todos';
import { Error } from '../../types/Error';
import { TodosContext } from '../TodosContext';

// const USER_ID = 11986;

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {};

export const Header: React.FC<Props> = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [value, setValue] = useState('');
  const {
    todos,
    setTodos,
    setErrorMessage,
    USER_ID,
  } = useContext(TodosContext);

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const isChecked = todos.every(todo => todo.completed) && todos.length > 0;

  const handleToggleAll = () => {
    const isAllCheked = todos.every(todo => todo.completed);
    const modifiedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllCheked,
    }));

    setTodos(modifiedTodos);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage(Error.Default);

    if (!value.trim()) {
      setErrorMessage(Error.EmptyTitle);
    } else {
      setIsSubmiting(true);
      todoService.createTodo({
        title: value.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch((error) => {
          setErrorMessage(Error.Add);
          throw error;
        });
      setIsSubmiting(false);
      setValue('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: isChecked })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};

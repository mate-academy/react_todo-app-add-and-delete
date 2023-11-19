/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from './TodosContext';
import * as todoService from '../api/todos';

export const Header: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    todos,
    setTodos,
    setErrorMessage,
    USER_ID,
  } = useContext(TodosContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputValue.trim() === '') {
        setErrorMessage('Title should not be empty');
      } else {
        todoService.addTodo({
          title: inputValue,
          completed: false,
          userId: USER_ID,
        }).then(newTodo => {
          setTodos([...todos, newTodo]);
        }).catch(() => setErrorMessage('Unable to add a todo'));

        setInputValue('');
      }
    }
  };

  const handleChangeToggle = () => {
    const completedValue = todos.some(todo => !todo.completed);

    const updatedTodos = todos.map(todo => {
      return ({
        ...todo,
        completed: completedValue,
      });
    });

    setTodos(updatedTodos);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <form onSubmit={(event) => event.preventDefault()}>
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            {
              active: todos.every(todo => todo.completed),
            },
          )}
          data-cy="ToggleAllButton"
          onClick={handleChangeToggle}
        />

        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          value={inputValue}
          placeholder="What needs to be done?"
          onChange={handleChange}
          onKeyPress={handlePressEnter}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

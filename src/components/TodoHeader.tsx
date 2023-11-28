/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { addTodo } from '../api/todos';
import { TodoContext } from './TodoContex';

const TodoHeader: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const {
    todos,
    setTodos,
    setErrorMessage,
    USER_ID,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePressEnter = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();

      if (!trimmedValue) {
        setErrorMessage('Title should not be empty');
      } else {
        try {
          const newTodo = await addTodo({
            title: trimmedValue,
            completed: false,
            userId: USER_ID,
          });

          setTodos([...todos, newTodo]);
          setInputValue('');
        } catch (error) {
          setErrorMessage('Unable to add a todo');
        }
      }
    }
  };

  const handleChangeToggle = () => {
    const completedValue = !todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: completedValue,
    }));

    setTodos(updatedTodos);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <form onSubmit={(event) => event.preventDefault()}>
        <button
          type="button"
          className={
            cn('todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) })
          }
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

export default TodoHeader;

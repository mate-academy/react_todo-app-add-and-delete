import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setVisibleError: (value: string) => void;
  addTodo: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setVisibleError,
  addTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const isToggleButtonVisible = todos.every(todo => todo.completed);

  const handleOnSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setInputValue('');
      setVisibleError('Title can\'t be empty');

      return;
    }

    try {
      addTodo(inputValue);
    } catch {
      setVisibleError('Can`t add todo');
    }

    setInputValue('');
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToggleButtonVisible,
        })}
        aria-label="todoapp__toggle-all"
      />

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};

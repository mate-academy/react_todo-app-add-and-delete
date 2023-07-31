import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../constants/constants';

type Props = {
  countTodoActive: number;
  addTodo: (newTodo: Todo) => void;
  setError: (message: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  countTodoActive, addTodo, setError,
}) => {
  const [todoName, setTodoName] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoName.trim()) {
      setError('Title can not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoName,
      completed: false,
    };

    addTodo(newTodo);
    setTodoName('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: countTodoActive === 0 },
        )}
      >
        {}
      </button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoName}
          onChange={(event) => setTodoName(event.target.value)}
        />
      </form>
    </header>
  );
};

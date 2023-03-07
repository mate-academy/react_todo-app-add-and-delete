/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { USER_ID } from '../utils/userId';
import { Todo } from '../types/Todo';

type Props = {
  onAddTodo: (todo: Pick<Todo, 'userId' | 'title' | 'completed'>) => void,
  inputDisable: boolean,
};

export const Header: React.FC<Props> = ({ onAddTodo, inputDisable }) => {
  const [newTodoValue, setNewTodoValue] = useState('');

  const createNewTodo = () => {
    const newTodo = {
      userId: USER_ID,
      title: newTodoValue,
      completed: false,
    };

    onAddTodo(newTodo);
    setNewTodoValue('');
  };

  const onFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewTodo();
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoValue}
          onChange={(e) => setNewTodoValue(e.target.value)}
          disabled={!inputDisable}
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoUpdateContext } from '../../context/TodosContext';

interface Props {
  todos: Todo[],
}

export const Header: React.FC<Props> = ({ todos }) => {
  const [titleField, setTitleField] = useState('');
  const { addTodo } = useContext(TodoUpdateContext);

  const USER_ID = 91;
  const todoIds = todos.map((todo) => (todo.id));

  const clearField = () => {
    setTitleField('');
  };

  const handleSubmit = () => {
    if (titleField.trim() !== '') {
      const newTodoItem: Todo = {
        id: Math.max(...todoIds, 0) + 1,
        userId: USER_ID,
        title: titleField,
        completed: false,
      };

      addTodo(newTodoItem);
    }

    clearField();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

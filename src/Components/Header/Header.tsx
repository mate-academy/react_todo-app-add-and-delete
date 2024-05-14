import React, { FormEvent, useContext, useState } from 'react';
import { TodosContext } from '../../TodosContext';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const { todos, addTodo, setTodos, toggleTodoCompleted, setErrorMessage } =
    useContext(TodosContext);

  const [toggleButton, setToggleButton] = useState(false);
  const [currentTitleValue, setCurrentTitlevalue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentTitleValue.trim().length > 0) {
      addTodo({
        id: new Date().getTime(),
        title: currentTitleValue.trim(),
        completed: false,
        userId: 478,
      });
    } else {
      setErrorMessage('Title should not be empty');
    }

    setCurrentTitlevalue('');
  };

  const handleTitleChenger = () => {
    let updateTodos;

    if (todos.find(item => item.completed === false)) {
      setToggleButton(true);
      updateTodos = todos.map(todo => {
        toggleTodoCompleted(todo.id, false);

        return { ...todo, completed: true };
      });
    } else {
      setToggleButton(false);
      updateTodos = todos.map(todo => {
        toggleTodoCompleted(todo.id, true);

        return { ...todo, completed: false };
      });
    }

    setTodos(updateTodos);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: toggleButton,
        })}
        data-cy="ToggleAllButton"
        onClick={handleTitleChenger}
      />

      {/* Add a todo on form submit */}
      <form action="/" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={currentTitleValue}
          onChange={event => {
            setCurrentTitlevalue(event.target.value);
          }}
        />
      </form>
    </header>
  );
};

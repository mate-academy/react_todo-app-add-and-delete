import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { Todo } from '../../types/Todo';
import * as todoServise from '../../api/todos';

export const Header: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  const allTodosAreCompleted = todos.every(todo => todo.completed === true);

  const correctTitle = newTodoTitle.trim();

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    todoServise.createTodo({ userId, title, completed }).then(newTodo => {
      if (correctTitle.length > 0) {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
      }
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosAreCompleted,
        })}
        data-cy="ToggleAllButton"
        aria-label="toggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={newTodoTitle}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};

import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import * as todoService from '../../api/todos';
import { USER_ID } from '../../api/todos';

export const Header: React.FC = () => {
  const { todos, setTodos, setErrorMessage } = useContext(TodoContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  const allTodosAreCompleted = todos.every(todo => todo.completed === true);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const correctTitle = newTodoTitle.trim();
    const emptyTitle = correctTitle.length <= 0;
    const isDuplicate = todos.some(todo => todo.title === newTodoTitle);

    if (correctTitle && !isDuplicate && !emptyTitle) {
      setIsSubmitting(true);

      todoService
        .createTodo({
          userId: USER_ID,
          title: correctTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoTitle('');
        })
        .finally(() => {
          setIsSubmitting(false);
          if (titleField.current) {
            titleField.current.focus();
          }
          /* eslint-disable-next-line */
          console.log(titleField.current);
        });
    } else {
      setNewTodoTitle('');
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
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
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};

// if (isDuplicate) {
//   setErrorMessage('This title already exists');
// }

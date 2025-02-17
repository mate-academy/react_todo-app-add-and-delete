import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
// import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContext';
import cn from 'classnames';
// import { addTodo } from '../api/todos';

export const NewTodo: React.FC = () => {
  const [title, setTitle] = useState('');
  const [titleReady, setTitileReady] = useState(false);
  const { todos, setError, addTodo } = useContext(TodoContext);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    // if (!!title.trim().length) {
    //   const addedTodo: Todo = {
    //     id: +new Date(),
    //     title: title.trim(),
    //     completed: false,
    //     userId: USER_ID,
    //   };

    //   setTitle('');

    //   dispatch({ type: 'addTodo', payload: addedTodo });
    // }
    setTitileReady(true);
    setError('');

    addTodo(title.trim())
      .then(() => setTitle(''))
      .finally(() => setTitileReady(false));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  // const completedTodos = todos.filter(todo => todo.completed === true);

  const allCompleted = todos.every(todo => todo.completed === true);

  const setAllCompleted = () => {
    if (allCompleted) {
      todos.map(todo => todo.completed === false);
    } else {
      todos.map(todo => todo.completed === true);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // useEffect(() => {
  //   if (allCompleted) {
  //     focusInput();
  //   }
  // }, [allCompleted]);

  useEffect(() => {
    focusInput();
  }, [todos.length, titleReady]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={setAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          autoFocus
          className={cn('todoapp__new-todo', { active: allCompleted })}
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={handleFormChange}
          onKeyDown={handleKeyDown}
          disabled={titleReady}
        />
      </form>
    </header>
  );
};

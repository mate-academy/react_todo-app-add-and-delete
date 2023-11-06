/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../context/TodosContext';
import { ErrorType } from '../types/ErrorType';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';

const USER_ID = 11826;

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    setError,
    setTempTodo,
    setTodos,
    todos,
    tempTodo,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const beforeResponse = () => {
    return setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(ErrorType.EmptyTitle);
    } else {
      beforeResponse();

      const newTodo: Omit<Todo, 'id'> = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      addTodo(newTodo).then((todo) => {
        setTitle('');
        setTempTodo(null);
        setTodos([...todos, todo]);
      })
        .catch(() => {
          beforeResponse();
          setError(ErrorType.Add);
        })
        .finally(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
          setTempTodo(null);
        });
    }
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
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputRef}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};

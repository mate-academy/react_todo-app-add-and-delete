import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { DispatchContex, StateContex } from '../../Store';
import { USER_ID, createTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useContext(DispatchContex);
  const { todos } = useContext(StateContex);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [todos]);

  const isAllCompleted =
    todos.filter(todo => todo.completed).length === todos.length;

  const handlerFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!newTitle.trim()) {
      dispatch({ type: 'set-error', payload: 'Title should not be empty' });
    } else {
      const newTodo = {
        title: newTitle.trim(),
        completed: false,
        userId: USER_ID,
      };

      setIsSubmitting(true);

      dispatch({ type: 'set-temp-todo', payload: { ...newTodo, id: 0 } });

      createTodo(newTodo)
        .then(todoFromServer => {
          dispatch({ type: 'add-todo', payload: todoFromServer });
          setNewTitle('');
        })
        .catch(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 1);

          dispatch({ type: 'set-error', payload: 'Unable to add a todo' });
        })
        .finally(() => {
          dispatch({ type: 'set-temp-todo', payload: null });
          setIsSubmitting(false);
        });
    }
  };

  const handlerSetAllStatus = () => {
    todos.forEach(({ id }) => {
      dispatch({
        type: 'set-complete',
        payload: { id, completed: !isAllCompleted },
      });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={handlerSetAllStatus}
        />
      )}

      <form onSubmit={handlerFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={evt => setNewTitle(evt.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};

import React, { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos } from '../../api/todos';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { Todo } from '../../types/Todo';
import { wait } from '../../utils/fetchClient';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useContext(DispatchContext);
  const { isAdding, todos } = useContext(StateContext);

  const textField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, [todos]);

  const setErrorTitle = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: 'Title should not be empty',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      setErrorTitle();

      return;
    }

    const preparingData = {
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    dispatch({ type: Actions.isAdding, status: true });
    dispatch({
      type: Actions.addTempTodo,
      preparingTodo: preparingData,
    });
    dispatch({ type: Actions.setErrorLoad, payload: '' });

    postTodos(title.trim())
      .then(newPost => {
        const typedNewPost = newPost as Todo;

        dispatch({
          type: Actions.postTodo,
          post: typedNewPost,
        });
        setTitle('');
      })
      .catch(error => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to add a todo',
        });

        throw error;
      })
      .finally(() => {
        wait(0).then(() => {
          textField.current?.focus();
        });

        dispatch({ type: Actions.isAdding, status: false });

        dispatch({
          type: Actions.addTempTodo,
          preparingTodo: null,
        });
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={textField}
          data-cy="NewTodoField"
          value={title}
          onChange={e => setTitle(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

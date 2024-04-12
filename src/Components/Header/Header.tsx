import React, { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos } from '../../api/todos';
import { Actions, DispatchContext, StateContext } from '../../Store';
export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useContext(DispatchContext);
  const { isAdding } = useContext(StateContext);
  const textField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, []);

  const setErrorTitle = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: '',
    });
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
      title: title,
      userId: USER_ID,
      completed: false,
    };

    dispatch({ type: Actions.isAdding, status: true });
    dispatch({
      type: Actions.addTempTodo,
      preparingTodo: preparingData,
    });

    postTodos(preparingData)
      .then((newPost: any) => {
        dispatch({
          type: Actions.postTodo,
          post: newPost,
        });
      })
      .catch(error => {
        dispatch({ type: Actions.isAdding, status: false });
        dispatch({
          type: Actions.addTempTodo,
          preparingTodo: null,
        });

        dispatch({
          type: Actions.setErrorLoad,
          payload: '',
        });
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to add a todo',
        });

        throw error;
      })
      .finally(() => {
        setTitle('');
        dispatch({ type: Actions.isAdding, status: false });
        textField.current?.focus();

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

/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useState } from 'react';
import { DispatchContext } from './TodosContext';
import { postTodo } from '../api/todos';

type Props = {
  USER_ID: number;
  setIsError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  USER_ID,
  setIsError,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const dispatch = useContext(DispatchContext);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      title,
      completed: false,
      id: +Date.now(),
      userId: USER_ID,
    };

    if (!title) {
      setIsError(true);
      setErrorMessage('Title should not be empty');

      return;
    }

    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: [0] },
    });

    dispatch({
      type: 'addTempTodo',
      payload: {
        title,
        completed: false,
        id: 0,
        userId: USER_ID,
      },
    });

    postTodo(newTodo)
      .then(response => {
        dispatch({ type: 'addTodo', payload: response });
        setTitle('');
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage('Failed to add a todo');
      })
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: { isLoading: false, todoIds: [] },
        });
        dispatch({ type: 'addTempTodo', payload: null });
      });
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
      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={(input) => input?.focus()}
        />
      </form>
    </header>
  );
};

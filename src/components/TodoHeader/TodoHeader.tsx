/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { Error } from '../../types/Error';
import { addTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../Context/Store';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { error, todos, userId } = useContext(StateContext);

  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => refInput.current?.focus(), []);

  useEffect(() => {
    refInput.current?.focus();
  }, [todos.length]);

  useEffect(() => {
    if (error === Error.UnableAddTodo) {
      refInput.current?.focus();
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedTitle = title.trim();
    const newTodo = {
      title: preparedTitle,
      completed: false,
      userId,
    };

    if (!preparedTitle) {
      dispatch({
        type: 'setError',
        payload: Error.TitleNotEmpty,
      });

      return;
    }

    setIsSending(true);
    dispatch({
      type: 'tempTodo',
      payload: {
        ...newTodo,
        id: 0,
      },
    });

    addTodo(newTodo)
      .then((response) => {
        dispatch({
          type: 'addTodo',
          payload: response,
        });
        setTitle('');
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: Error.UnableAddTodo,
        });
        setTitle(preparedTitle);
      })
      .finally(() => {
        dispatch({
          type: 'tempTodo',
          payload: null,
        });
        setIsSending(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => { }}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={refInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSending}
        />
      </form>
    </header>
  );
};

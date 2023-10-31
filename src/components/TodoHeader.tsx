/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { ActionType } from '../states/Reducer';
import { DispatchContext, StateContext } from '../states/Global';
import { postTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

export const TodoHeader: React.FC = React.memo(() => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { userId, todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => inputRef.current?.focus(), []);

  const createTodo = (preparedTitle: string) => {
    postTodo({
      userId,
      title: preparedTitle,
      completed: false,
    })
      .then(response => {
        setTitle('');

        dispatch({
          type: ActionType.CreateTodo,
          payload: {
            todo: response,
          },
        });
      })
      .catch(() => {
        setTitle(preparedTitle);

        dispatch({
          type: ActionType.ToggleError,
          payload: { errorType: ErrorType.CreateError },
        });
      })
      .finally(() => {
        setIsLoading(false);

        dispatch({
          type: ActionType.SetTempTodo,
          payload: { tempTodo: null },
        });
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const tempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    dispatch({
      type: ActionType.SetTempTodo,
      payload: { tempTodo },
    });

    if (title.trim()) {
      createTodo(title.trim());
    } else {
      setIsLoading(false);
      dispatch({
        type: ActionType.ToggleError,
        payload: { errorType: ErrorType.TitleError },
      });
      dispatch({
        type: ActionType.SetTempTodo,
        payload: { tempTodo: null },
      });
    }
  };

  useEffect(() => inputRef.current?.focus(), [isLoading]);

  const toggleAll = () => {};

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});

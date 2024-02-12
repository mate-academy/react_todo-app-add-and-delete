/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';
import { DispatchContext, StateContext } from '../Context/StateContext';
import { createTodo } from '../../api/todos';
import { Notification } from '../../types/Notification';
import { USER_ID } from '../../utils/constants';

export const Header: React.FC = () => {
  const { todos, notification } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const allTodosIds = todos.map(todo => todo.id);

  const [newTitle, setNewTitle] = useState('');
  const [isDisadledInput, setIsDisadledInput] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const allCompleted = todos.every(todo => todo.completed);

  const handlerToggleAll = () => {
    dispatch({
      type: 'showLoader',
      payload: allTodosIds,
    });

    setTimeout(() => dispatch({
      type: 'showLoader',
      payload: [0],
    }), 500);

    dispatch({
      type: 'toggleCompleted',
      payload: !allCompleted,
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const correctNewTitle = newTitle.trim();

  const addTodo = () => {
    dispatch({
      type: 'updateTempTodo',
      tempTodo: {
        id: 0,
        userId: USER_ID,
        title: correctNewTitle,
        completed: false,
      },
    });

    createTodo({
      userId: USER_ID,
      title: correctNewTitle,
      completed: false,
    })
      .then((newTodo) => {
        dispatch({
          type: 'addTodo',
          newTodo,
        });

        setNewTitle('');
      })
      .catch(() => {
        dispatch({
          type: 'showNotification',
          notification: Notification.ADD_TODO,
        });
      })
      .finally(() => {
        setIsDisadledInput(false);
        dispatch({
          type: 'updateTempTodo',
          tempTodo: null,
        });
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (correctNewTitle) {
      setIsDisadledInput(true);
      addTodo();
    } else {
      dispatch({
        type: 'showNotification',
        notification: Notification.EMPTY_TITLE,
      });
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todos, notification]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handlerToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleTitleChange}
          disabled={isDisadledInput}
        />
      </form>
    </header>
  );
};

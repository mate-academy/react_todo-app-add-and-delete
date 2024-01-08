/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from './TodosContext';
import { USER_ID } from '../utils/constants';
import { createTodo } from '../api/todos';

export const Header: React.FC = () => {
  const { todos, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState('');

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleChangeAllCompleted = () => {
    dispatch({
      type: 'changeAllCompleted',
      payload: isAllCompleted,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      dispatch({
        type: 'setErrorMessage',
        payload: 'Title should not be empty',
      });

      return;
    }

    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: [0] },
    });

    dispatch({
      type: 'addTempTodo',
      payload: {
        title: newTitle,
        id: 0,
        completed: false,
        userId: USER_ID,
      },
    });

    createTodo({
      title: newTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(response => {
        dispatch({
          type: 'addTodo',
          payload: response,
        });
        setTitle('');
      })
      .catch(() => dispatch({
        type: 'setErrorMessage',
        payload: 'Unable to add a todo',
      }))
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: { isLoading: false },
        });
        dispatch({
          type: 'addTempTodo',
          payload: null,
        });
      });
  };

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleChangeAllCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInput}
          value={title}
          onChange={handleChange}
          disabled={loading.isLoading}
        />
      </form>
    </header>
  );
};

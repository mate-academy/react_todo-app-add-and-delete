import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../management/TodoContext';
import { USER_ID, createTodos } from '../api/todos';

export const Header: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, isLoading } = useContext(StateContext);
  const userId = USER_ID;
  const [title, setTitle] = useState('');

  const completedAll = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !title && !isLoading) {
      inputRef.current.focus();
    }
  }, [title, isLoading]);

  const hendleAddedTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const data = {
      title: title.trim(),
      userId,
      completed: false,
    };

    if (data.title.trim()) {
      dispatch({
        type: 'tempTodo',
        payload: {
          createdAt: '',
          updatedAt: '',
          id: 0,
          userId,
          title: title.trim(),
          completed: false,
        },
      });

      createTodos(data)
        .then(newTodo => {
          dispatch({
            type: 'addTodo',
            payload: newTodo,
          });
          setTitle('');
        })
        .catch(() => {
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to add a todo',
          });
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus();
          }

          dispatch({ type: 'tempTodo', payload: null });
        });
    } else {
      dispatch({
        type: 'errorMessage',
        payload: 'Title should not be empty',
      });

      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    }
  };

  const hendleChangeStatusAll = () => {
    dispatch({
      type: 'changeStatusAll',
      payload: !completedAll,
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedAll,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all completed"
          onClick={hendleChangeStatusAll}
        />
      )}

      <form onSubmit={hendleAddedTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        // onBlur={hendleAddedTodo}
        />
      </form>
    </header>
  );
};

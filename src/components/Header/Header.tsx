import {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../constants/user';
import { DispatchContext, StateContext } from '../../State/State';
import { handleToggleAll } from '../../services/todosServices';

export const Header = () => {
  const [todo, setTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { todos, activeTodos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const inputTodo = useRef<HTMLInputElement>(null);

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault();
    const preperedTodo = todo.trim();

    if (!preperedTodo.length) {
      dispatch({ type: 'setError', payload: 'Title should not be empty' });
      setTodo('');

      return;
    }

    setIsSubmitting(true);

    const newTodo = {
      title: preperedTodo,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    dispatch({ type: 'setTempTodo', payload: newTodo });

    createTodo(newTodo)
      .then(res => {
        setTodo('');
        dispatch({ type: 'addActiveTodo', payload: res });
      })
      .catch(() => {
        dispatch(
          { type: 'setError', payload: 'Unable to add a todo' },
        );
      })
      .finally(() => {
        setIsSubmitting(false);
        dispatch({ type: 'setTempTodo', payload: null });
      });
  }

  useEffect(() => {
    if (inputTodo.current) {
      inputTodo.current.focus();
    }
  }, [todos, isSubmitting]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !activeTodos,
          })}
          onClick={() => handleToggleAll(dispatch, todos, activeTodos)}
          data-cy="ToggleAllButton"
          aria-label="Set all"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={event => setTodo(event.target.value)}
          disabled={isSubmitting}
          ref={inputTodo}
        />
      </form>
    </header>
  );
};

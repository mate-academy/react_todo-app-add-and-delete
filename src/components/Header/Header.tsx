import {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { createTodo, updateTodo } from '../../api/todos';
import { USER_ID } from '../../constants/user';
import { DispatchContext, StateContext } from '../../State/State';

export const Header = () => {
  const [todo, setTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const inputTodo = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(el => !el.completed).length;

  useEffect(() => {
    if (inputTodo.current) {
      inputTodo.current.focus();
    }
  }, [todos, isSubmitting]);

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault();
    const preperedTodo = todo.trim();

    if (!preperedTodo.length) {
      dispatch({
        type: 'setError',
        payload: 'Title should not be empty',
      });
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

    dispatch({
      type: 'setTempTodo',
      payload: newTodo,
    });

    createTodo(newTodo)
      .then(res => {
        setTodo('');
        dispatch({ type: 'addTodo', payload: res });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: 'Unable to add a todo',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        dispatch({
          type: 'setTempTodo',
          payload: null,
        });
      });
  }

  function handleToggleAll() {
    const todosForUpdateIds = todos.reduce((prev, el) => {
      if (el.completed === !activeTodos) {
        return [...prev, el.id];
      }

      return prev;
    }, [] as number[]);

    dispatch({ type: 'saveTodosForUpdateId', payload: todosForUpdateIds });

    todosForUpdateIds.forEach(id => {
      updateTodo({ completed: !!activeTodos, id })
        .then(updatedTodo => {
          dispatch({ type: 'updateTodo', payload: updatedTodo });
        })
        .catch(() => dispatch({
          type: 'setError',
          payload: 'Unable to update a todos',
        }))
        .finally(() => {
          dispatch({ type: 'saveTodosForUpdateId', payload: [] });
        });
    });
  }

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !activeTodos,
          })}
          onClick={handleToggleAll}
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

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef, useState,
} from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../../Store';
import { USER_ID } from '../../lib/user';
import { addTodo, updateTodo } from '../../api/todos';
import { Error } from '../../types/Error';

export const TodoHeader: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, inputValue } = useContext(StateContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.AddTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleUpdateTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.UpdateTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleInputValueChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({ type: 'setInputValue', payload: event.target.value });
  }, [dispatch]);

  const handleToggleAll = useCallback(() => {
    const hasActiveTodos = todos.some(todo => !todo.completed);

    todos.filter(todo => todo.completed !== hasActiveTodos).forEach(
      async (todo) => {
        dispatch({ type: 'addLoading', payload: todo });

        try {
          await updateTodo(todo.id, { completed: hasActiveTodos });
          dispatch({ type: 'toggleTodo', payload: todo });
        } catch (error) {
          handleUpdateTodoError();
        } finally {
          dispatch({ type: 'deleteLoading', payload: todo });
        }
      },
    );
  }, [todos, dispatch, handleUpdateTodoError]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = inputValue.trim();

    if (!trimmedTitle) {
      dispatch({ type: 'setError', payload: Error.EmptyTitleError });
      setTimeout(() => {
        dispatch({ type: 'setError', payload: '' });
      }, 3000);

      return;
    }

    setIsSubmitting(true);
    dispatch({
      type: 'setTempTodo',
      payload: {
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      },
    });

    try {
      const {
        id,
        userId,
        title,
        completed,
      } = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      dispatch({
        type: 'addTodo',
        payload: {
          id,
          userId,
          title,
          completed,
        },
      });
      dispatch({ type: 'setInputValue', payload: '' });
    } catch (error) {
      handleAddTodoError();
    } finally {
      dispatch({ type: 'setTempTodo', payload: null });
      setIsSubmitting(false);
    }
  }, [dispatch, handleAddTodoError, inputValue]);

  useEffect(() => {
    if (inputRef && (!isSubmitting)) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos.length]);

  return (
    <header className="todoapp__header">

      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          aria-label="Toggle all"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="NewTodoField"
          ref={inputRef}
          value={inputValue}
          disabled={isSubmitting}
          aria-label="Enter New todo"
          placeholder="What needs to be done?"
          className="todoapp__new-todo"
          onChange={handleInputValueChange}
        />
      </form>
    </header>
  );
};

import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StateContext } from '../../store/store';
import { USER_ID, postTodo } from '../../api/todos';
import cn from 'classnames';

export const Header = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, focusNewTodo, idTodoSubmitting } = useContext(StateContext);
  const [newTodo, setNewTodo] = useState('');
  const [isVaitingAdd, setIsVaitingAdd] = useState(false);

  const allTodosComplete = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  const addNewTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.blur();

    if (newTodo.trim() && !idTodoSubmitting) {
      // dispatch({ type: 'AddTodo', title: newTodo });
      setIsVaitingAdd(true);

      postTodo({
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(res => {
          setNewTodo('');
          dispatch({ type: 'setFocudNewTodo' });
          dispatch({ type: 'AddTodo', todo: res });
        })
        .catch(() => {
          dispatch({ type: 'setError', error: 'Unable to add a todo' });
          dispatch({ type: 'removeTodo', id: 0 });
        })
        .finally(() => {
          dispatch({ type: 'setIdTodoSelection', id: 0 });
          inputRef.current?.focus();
          setIsVaitingAdd(false);
        });
    } else if (!newTodo.trim()) {
      dispatch({ type: 'setError', error: 'Title should not be empty' });
      inputRef.current?.focus();
      setNewTodo('');
    }
  };

  useEffect(() => {
    if (focusNewTodo) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focusNewTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosComplete,
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            dispatch({ type: 'setAllCompleate', use: allTodosComplete })
          }
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={addNewTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isVaitingAdd}
          value={newTodo}
          onClick={() => dispatch({ type: 'setFocudNewTodo' })}
          onBlur={() => dispatch({ type: 'setFocudNewTodo' })}
          onChange={e => setNewTodo(e.target.value.toString())}
        />
      </form>
    </header>
  );
};

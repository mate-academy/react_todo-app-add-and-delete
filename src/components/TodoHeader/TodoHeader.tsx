import { memo, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import classNames from 'classnames';
import { USER_ID, addTodo } from '../../api/todos';

export const TodoHeader: React.FC = memo(() => {
  // TODO check some problems with POST
  const { state, dispatch } = useContext(AppContext);
  const { todos, inputDisabled, errors } = state;
  const allCompleted =
    todos.every(todo => todo.completed) && state.todos.length > 0;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errors]);

  const [todo, setTodo] = useState('');

  const handleTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todo.trim()) {
      dispatch({
        type: 'UPDATE_ERROR_STATUS',
        payload: { type: 'EmptyTitleError' },
      });

      return;
    }

    const newTodo = {
      id:
        state.todos.length > 0
          ? Math.max(...state.todos.map(task => task.id)) + 1
          : 1,
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    };

    try {
      dispatch({ type: 'SET_INPUT_DISABLED', payload: true });
      dispatch({
        type: 'CREATE_TEMP_TODO',
        payload: { id: 0, title: todo.trim() },
      });

      const response = await addTodo(newTodo);

      if (response) {
        dispatch({ type: 'ADD_TODO', payload: response });
        setTodo('');
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ERROR_STATUS',
        payload: { type: 'AddTodoError' },
      });
    } finally {
      dispatch({ type: 'SET_INPUT_DISABLED', payload: false });
      dispatch({ type: 'CREATE_TEMP_TODO', payload: null });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleTodoSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={event => setTodo(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
});

TodoHeader.displayName = 'TodoHeader';

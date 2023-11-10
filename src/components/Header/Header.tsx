import {
  useContext, useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { NoIdTodo } from '../../types/NoIdTodo';
import { TodosContext } from '../TodosProvider';
import { USER_ID } from '../../utils/constants';

export const Header: React.FC = () => {
  const {
    addTodoHandler,
    todosFromServer,
    setTodosError,
    responceTodo,
    isEditing,
  } = useContext(TodosContext);
  const isAllActiveTodos = todosFromServer.every((todo) => !todo.completed);
  const [newTodo, setNewTodo] = useState('');

  const inputFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  });

  useEffect(() => {
    if (typeof responceTodo !== 'string') {
      if (responceTodo?.title === newTodo.trim()) {
        setNewTodo('');
      }
    }
  }, [newTodo, responceTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodo || !newTodo.trim()) {
      setTodosError('Title should not be empty');

      return;
    }

    const post: NoIdTodo = {
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    addTodoHandler(post);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {todosFromServer.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !isAllActiveTodos,
          })}
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          aria-label="NewTodoField"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          ref={inputFocus}
          disabled={isEditing}
        />
      </form>
    </header>
  );
};

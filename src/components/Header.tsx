import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Todo } from '../types/Todo';
import { postTodo } from '../api/todos';

import { PageContext } from '../utils/GlobalContext';

type Props = {
  todos: Todo[],
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

export const Header: React.FC<Props> = ({ todos, setTempTodo }) => {
  const {
    setTodoList,
    setError,
    isLoading,
    setIsLoading,
    USER_ID,
  } = useContext(PageContext);
  const activeTodos = todos.filter(todo => !todo.completed);
  const [value, setValue] = useState('');
  const newTodoTitle = value.trim();
  const addTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addTodoRef.current?.focus();
  }, []);

  const tempTodo = {
    id: 0,
    userId: USER_ID,
    title: newTodoTitle,
    completed: false,
  };

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const maxId = Math.max(0, ...todos.map(todo => todo.id));
    const newTodoId = maxId + 1;

    if (!newTodoTitle) {
      setError('Title should not be empty');
    } else {
      setIsLoading(true);

      setTempTodo(tempTodo);
      postTodo(USER_ID, newTodoTitle, newTodoId)
        .then(newTodoItem => {
          setTempTodo(null);
          setTodoList([...todos, newTodoItem]);
          setValue('');
        })
        .catch((error) => {
          setTempTodo(null);
          setError('Unable to add a todo');
          throw error;
        });
      setIsLoading(false);
    }

    addTodoRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeTodos },
        )}
        data-cy="ToggleAllButton"
        aria-label="toggle-all"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addTodo}>
        <input
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => setValue(event.target.value)}
          onClick={() => setError('')}
          ref={addTodoRef}
        />
      </form>
    </header>
  );
};

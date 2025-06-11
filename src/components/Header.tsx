import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { addTodo, changeTodo, USER_ID } from '../api/todos';
import { useEffect, useState } from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  title: string;
  setTitle: (t: string) => void;
  setTempTodo: (t: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};
export const Header = ({
  todos,
  setTodos,
  setTempTodo,
  title,
  setTitle,
  setErrorMessage,
  inputRef,
}: Props) => {
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!formLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formLoading, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setFormLoading(true);

    setTempTodo({
      title: title.trim(),
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => setFormLoading(false));
  };

  const handleToggle = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const newStatus = allCompleted ? false : true;

    Promise.all(
      todos.map(todo => changeTodo(todo.id, { completed: newStatus })),
    )
      .then(() =>
        setTodos(
          todos.map(todo => {
            return { ...todo, completed: newStatus };
          }),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggle}
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={formLoading}
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setErrorMessage('');
          }}
        />
      </form>
    </header>
  );
};

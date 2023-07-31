import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorStatus } from '../types/ErrorStatus';
import { createTodo, getTodos } from '../api/todos';
import { USER_ID } from '../utils/constants';

interface Props {
  todos: Todo[],
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (value: string) => void,
  setTempTodo: (value: Todo | null) => void,
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');

  const completedTodos = todos.every(todo => todo.completed);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage(ErrorStatus.Title);

      return;
    }

    const newTodo = { title, userId: USER_ID, completed: false };

    setTempTodo({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setTempTodo(null);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Add);
      });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            aria-label="btn"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedTodos,
            })}
          />
        )}

      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

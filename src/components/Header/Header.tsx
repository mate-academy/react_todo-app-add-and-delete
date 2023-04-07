import { FC, useState, FormEvent } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { USER_ID, addTodo } from '../../api/todos';
import { TodoCondition } from '../../types/TodoCondition';

type Props = {
  containsActive: boolean,
  handleError: (err: Error) => void,
  setTodoCondition: (arg: TodoCondition) => void,
  onTrickTempTodo: (newTodo: Todo | null) => void,
  setTodos: (prev: any) => void,
};

export const Header: FC<Props> = ({
  containsActive,
  handleError,
  setTodoCondition,
  onTrickTempTodo,
  setTodos,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      return handleError(Error.EmptyInput);
    }

    setIsInputDisabled(true);
    setTodoCondition(TodoCondition.seving);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    onTrickTempTodo(newTodo);
    setTitle('');

    return addTodo(newTodo)
      .then(() => {
        onTrickTempTodo(null);
        setTodos((prev: Todo[]) => [...prev, newTodo]);
      })
      .catch(() => handleError(Error.Add))
      .finally(() => {
        setTodoCondition(TodoCondition.neutral);
        setIsInputDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: containsActive },
        )}
        aria-label="Complete all todos button"
      />

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

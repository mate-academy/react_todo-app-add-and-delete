import { FormEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';
import { addOnServer, getTodos, updateOnServer } from '../api/todos';

type Props = {
  userId: number;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (value: ErrorType) => void;
  setUpdatingTodos: (value: number[]) => void;
  setTempTodo: (value: Todo | null) => void;
};

export const NewTodo: React.FC<Props> = ({
  userId,
  todos,
  setTodos,
  setError,
  setUpdatingTodos,
  setTempTodo,

}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTodoTitle.trim().length) {
      setError(ErrorType.Empty);

      return;
    }

    const createdTodo = {
      title: newTodoTitle,
      userId,
      completed: false,
    };

    const tempTodo = {
      ...createdTodo,
      id: 0,
    };

    setTempTodo(tempTodo);

    setDisabledInput(true);

    addOnServer(createdTodo)
      .then(() => getTodos(userId))
      .then((updatedTodoList) => {
        setTodos(updatedTodoList);
      })
      .catch(() => {
        setError(ErrorType.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setDisabledInput(false);
      });

    setNewTodoTitle('');
  }

  const visibleTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed);

  function handleTodosStatus(status: boolean) {
    let updatedTodos = [...todos];
    const updatedTodoIds = updatedTodos.map(todo => todo.id);

    setUpdatingTodos(updatedTodoIds);

    updatedTodos = updatedTodos.map((todo) => ({ ...todo, completed: status }));

    updatedTodos.forEach(todo => updateOnServer(todo.id, { completed: status })
      .then(() => setTodos(updatedTodos))
      .catch(() => setError(ErrorType.Update))
      .finally(() => setUpdatingTodos([])));
  }

  return (
    <header className="todoapp__header">
      {visibleTodos > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodos.length === visibleTodos,
          })}
          onClick={
            () => handleTodosStatus(completedTodos.length !== todos.length)
          }
        />
      )}

      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabledInput}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

/* eslint-disable @typescript-eslint/indent */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { errorMessages, TEMP_TODO } from '../../utils/const';
import classNames from 'classnames';
import { addTodo, updateTodo } from '../../utils/helpers';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<
    React.SetStateAction<{ hasError: boolean; message: string }>
  >;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  hasVisible: boolean;
};
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setTempTodo,
  setIsLoading,
  isLoading,
  hasVisible,
}) => {
  const [title, setTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      setTempTodo({ ...TEMP_TODO, title: trimmedTitle });
      setIsLoading(true);
      addTodo({ title: trimmedTitle, userId: 1318, completed: false })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitle('');
        })
        .catch(() =>
          setError({ hasError: true, message: errorMessages.addingError }),
        )
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
        });
    } else {
      setError({ hasError: true, message: errorMessages.emptyError });
    }
  };

  const statusToggle = async () => {
    setIsLoading(true);

    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted); // Фільтруємо тільки ті, які потрібно оновити

    const updatedTodos = await Promise.all(
      todosToUpdate.map(async todo => {
        const updatedTodo = await updateTodo(todo.id, {
          completed: !todo.completed,
        });

        return updatedTodo;
      }),
    );

    setTodos(currentTodos =>
      currentTodos.map(
        todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
      ),
    );

    setIsLoading(false);
  };

  return (
    <header className="todoapp__header">
      {hasVisible && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={statusToggle}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

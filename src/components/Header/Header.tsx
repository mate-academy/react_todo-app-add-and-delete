import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/Errors';

interface Props {
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onLoading: React.Dispatch<React.SetStateAction<number[]>>;
  onTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onErrorMessage: (message: ErrorMessages) => void;
  todos: Todo[];
  disabledButton: boolean;
  loading: number[];
}

export const Header: React.FC<Props> = ({
  onTodos,
  onErrorMessage,
  onLoading,
  onTempTodo,
  todos,
  disabledButton,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLoading(prev => [...prev, 0]);
    setDisabledInput(true);
    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      onErrorMessage(ErrorMessages.Empty);
      onTempTodo(null);
      setDisabledInput(false);

      return;
    }

    const newTodo = {
      id: 0,
      title: trimmedQuery,
      userId: todoService.USER_ID,
      completed: false,
    };

    onTempTodo(newTodo);

    todoService
      .addTodos(newTodo)
      .then(newPost => {
        onTodos(currentTodos => [...currentTodos, newPost]);
        setQuery('');
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        onErrorMessage(ErrorMessages.Add);
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .finally(() => {
        onTempTodo(null);
        setDisabledInput(false);
        onLoading(prev => prev.filter(item => item !== 0));
      });
  };

  const handleClickAllCompleted = (todosToUpdate: Todo[]) => {
    todosToUpdate.map(todoToUpdate => {
      if ((!disabledButton && !todoToUpdate.completed) || disabledButton) {
        onLoading(prev => [...prev, todoToUpdate.id]);

        todoService
          .updateTodos({
            ...todoToUpdate,
            completed: disabledButton ? false : true,
          })
          .then(() => {
            onTodos(currentTodos =>
              currentTodos.map(item => {
                return { ...item, completed: disabledButton ? false : true };
              }),
            );
          })
          .catch(() => onErrorMessage(ErrorMessages.Update))
          .finally(() => {
            onLoading(prev => prev.filter(item => item !== todoToUpdate.id));
          });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {loading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: disabledButton,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleClickAllCompleted(todos)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          disabled={disabledInput}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

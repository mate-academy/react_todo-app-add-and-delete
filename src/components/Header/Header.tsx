import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  todos: Todo[];
  addNewTodo: (title: string) => Promise<void>;
  setError: (error: Errors) => void;
}

export const Header: React.FC<Props> = React.memo(
  ({ todos, addNewTodo, setError }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const textField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (textField.current && !isLoading) {
        textField.current.focus();
      }
    }, [isLoading]);

    const onFormSubmit = useCallback((event: React.FormEvent) => {
      event.preventDefault();

      if (isLoading) {
        return;
      }

      if (!newTodoTitle.trim()) {
        setError(Errors.emptyTitle);
      } else {
        setIsLoading(true);

        addNewTodo(newTodoTitle)
          .then(() => {
            setNewTodoTitle('');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [addNewTodo, newTodoTitle, setError, isLoading]);

    const onInputChange = useCallback((
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setNewTodoTitle(event.target.value);
    }, []);

    const hasActiveTodo = useMemo(() => {
      return todos.some(todo => !todo.completed);
    }, [todos]);

    return (
      <header className="todoapp__header">
        {hasActiveTodo && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
        )}

        <form
          onSubmit={onFormSubmit}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            disabled={isLoading}
            ref={textField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={onInputChange}
          />
        </form>
      </header>
    );
  },
);

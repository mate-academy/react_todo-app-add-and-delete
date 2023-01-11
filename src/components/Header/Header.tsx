import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { addTodo } from '../../api/todos';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';

interface HeaderProps {
  todos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  loadingTodosFromServer: () => void;
}
export const Header: FunctionComponent<HeaderProps> = ({
  todos,
  title,
  setTitle,
  isAdding,
  setIsAdding,
  setErrorMessage,
  loadingTodosFromServer,
}) => {
  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onSubmitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(Errors.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadingTodosFromServer();
        } catch {
          setErrorMessage(Errors.Adding);
        } finally {
          setIsAdding(false);
        }
      } else {
        setErrorMessage(Errors.Title);
      }

      setTitle('');
    }, [title, user],
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classnames('todoapp__toggle-all', {
            'todoapp__toggle-all active':
            todos.every(todo => todo.completed),
          })}
        />
      )}
      <form onSubmit={onSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={
            (e) => setTitle(e.target.value)
          }
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

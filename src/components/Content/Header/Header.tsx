import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from 'react';
import { createTodo } from '../../../api/todos';
import { AuthContext } from '../../Auth/AuthContext';
import { Todo } from '../../../types/Todo';
import { Error } from '../../../types/Error';

type Props = {
  todos: Todo[];
  onAddTodo: (newTodo: Todo) => void;
  onSetTempTodo: (userId?: number, title?: string) => void;
  onError: (error: Error | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onAddTodo,
  onSetTempTodo,
  onError,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async (newTitle: string) => {
    setIsAdding(true);
    onError(null);

    try {
      if (!newTitle.trim()) {
        onError(Error.TITLE);
        setIsAdding(false);

        return;
      }

      if (user) {
        onSetTempTodo(user.id, newTitle);

        const newTodo = await createTodo({
          userId: user.id,
          title: newTitle,
          completed: false,
        });

        onAddTodo(newTodo);
      }
    } catch {
      onError(Error.ADD_TODO);
    } finally {
      setIsAdding(false);
      onSetTempTodo();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    handleAddTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="ToggleAll"
        />
      )}

      <form
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={isAdding}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

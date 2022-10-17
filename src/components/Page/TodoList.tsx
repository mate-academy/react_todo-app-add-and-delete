import classNames from 'classnames';
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TodosError } from '../../types/ErrorEnum';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';

type Props = {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => Promise<void>;
  isAdding: boolean;
  handleStatus: (todoId: number, data: Partial<Todo>) => Promise<void>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  newTodoField: React.RefObject<HTMLInputElement>;
  setTodosError: (value: React.SetStateAction<TodosError>) => void;
  upgradeTodos: (todoId: number, data: Partial<Todo>) => Promise<void>;
  input: string;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  removeTodo,
  isAdding,
  handleStatus,
  setIsAdding,
  newTodoField,
  setTodosError,
  upgradeTodos,
  input,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [todos, setTodos] = useContext(TodoContext);
  const handleDelete = useCallback((todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  }, [todos]);

  const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [doubleClickId, setDoubleClickId] = useState<number | null>(null);

  const handleDoubleClick = useCallback((todoId: number, title: string) => {
    setIsDoubleClick(!isDoubleClick);
    setDoubleClickId(todoId);
    setName(title);
  }, [name, todos]);

  const handleChangeName = useCallback(({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value), [name]);

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDoubleClick(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [todos, name]);

  const handleRenameSubmit = useCallback(async (
    event: FormEvent,
    todoId: number,
  ) => {
    event.preventDefault();

    setIsAdding(true);

    if (!name.trim().length) {
      try {
        await removeTodo(todoId);

        setTodos([...todos.filter((
          { id },
        ) => id !== todoId)]);
      } catch {
        setTodosError(TodosError.Deleting);
      }
    }

    upgradeTodos(todoId, { title: name });

    setIsDoubleClick(false);
    setIsAdding(false);
  }, [name]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => handleStatus(id, { completed: !completed })}
              />
            </label>

            {(isDoubleClick && doubleClickId === id)
              ? (
                <form onSubmit={event => handleRenameSubmit(event, id)}>
                  <input
                    data-cy="NewTodoField"
                    type="text"
                    ref={newTodoField}
                    className="todoapp__rename-todo"
                    placeholder="Empty Todo will be deleted"
                    value={name}
                    onChange={handleChangeName}
                    disabled={isAdding}
                  />
                </form>
              )
              : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {title}
                </span>
              )}

            {!isDoubleClick && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => handleDelete(id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal',
                'overlay',
                { 'is-active': id === deletedId },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{input}</span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

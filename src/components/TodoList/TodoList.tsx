import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, getTodos } from '../../api/todos';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredTodos: Todo[];
  todos: Todo[];
  loading: boolean;
  showErrorWithDelay: (errorMessage: string) => void;
  handleCompleted: (elem: number, completed: boolean) => void;
  USER_ID: 11719;
};

export const TodoList: React.FC<Props> = ({
  setTodos,
  setLoading,
  filteredTodos,
  todos,
  loading,
  showErrorWithDelay,
  handleCompleted,
  USER_ID,
}) => {
  const [changedElement, setChangedElement] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTodoChange = () => {
    showErrorWithDelay('Unable to update a todo');
  };

  const loseFocus = () => {
    setIsEditing(false);
    setFocus(false);
    setEditId(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyDown = event.key;

    if (keyDown === 'Enter') {
      handleTodoChange();
      loseFocus();
    }

    if (keyDown === 'Escape') {
      loseFocus();
    }
  };

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  const handleDoubleClick = useCallback((elem: Todo) => {
    const selectedTodo = todos.find(item => item.id === elem.id);

    if (selectedTodo && selectedTodo.title) {
      setChangedElement(selectedTodo.title);
      if (elem.id) {
        setEditId(elem.id);
      }
    }

    setIsEditing(true);
    setFocus(true);
  }, [todos, setChangedElement, setEditId, setIsEditing, setFocus]);

  const handleOnBlur = () => {
    handleTodoChange();
    setIsEditing(false);
    setFocus(false);
    setEditId(null);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        getTodos(USER_ID)
          .then((todo) => {
            setTodos(todo);
            setLoading(true);
          })
          .catch((fetchError) => {
            setLoading(false);
            showErrorWithDelay('Unable to delete a todo');
            throw fetchError;
          });
      });
  };

  return (
    loading ? (
      <section className="todoapp__main" data-cy="TodoList">
        { filteredTodos.map((todo) => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => handleCompleted(todo.id, todo.completed)}
              />
            </label>
            {editId === todo.id && isEditing ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={changedElement || ''}
                  onChange={(event) => {
                    setChangedElement(event.target.value);
                  }}
                  onBlur={handleOnBlur}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(todo)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
      </section>
    ) : null
  );
};

import {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import classNames from 'classnames';
import { User } from '../types/User';
import { deleteTodos, EditTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  todo: Todo,
  foundTodoList: (u: User) => void,
  setErrorUpdate:(value: boolean) => void,
  setErrorRemove: (value: boolean) => void,
  setHidden: (value: boolean) => void,
  selectComplited: (toDo: Todo) => Promise<void>,
  clearLoader: boolean,
  loadingAllTodos: boolean,
  onIsLoading: (value: Todo | null) => void,
  isLoading: Todo | null,
};

export const ToDo: React.FC<Props> = ({
  todo,
  foundTodoList,
  setErrorUpdate,
  setErrorRemove,
  setHidden,
  selectComplited,
  clearLoader,
  loadingAllTodos,
  onIsLoading,
  isLoading,
}) => {
  const user = useContext(AuthContext);
  const [editTodoTitile, setEditTodoTitle] = useState('');
  const [toggleDoubleClick, setToggleDoubleClick] = useState<Todo | null>(null);
  const editTitle = useRef<HTMLInputElement>(null);

  const removeTodo = async (toDo:Todo) => {
    deleteTodos(toDo);
    try {
      onIsLoading(toDo);
      await deleteTodos(toDo);
    } catch {
      setErrorRemove(true);
      setHidden(false);
    }

    if (user) {
      foundTodoList(user);
    }
  };

  const editingTodo = async (toDo:Todo) => {
    const validTodoTitle = editTodoTitile.trim();

    if (validTodoTitle.length < 1) {
      setToggleDoubleClick(null);
      removeTodo(toDo);

      return;
    }

    if (validTodoTitle === toDo.title) {
      setToggleDoubleClick(null);

      return;
    }

    try {
      onIsLoading(toDo);
      setToggleDoubleClick(null);
      await EditTodo(toDo, validTodoTitle);
    } catch {
      setErrorUpdate(true);
      setHidden(false);
    }

    if (user) {
      foundTodoList(user);
    }

    setToggleDoubleClick(null);
  };

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }

    const handleClick = (event: any) => {
      if (!editTitle.current?.contains(event.target)) {
        setToggleDoubleClick(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [toggleDoubleClick]);

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }
  }, [toggleDoubleClick]);

  const handlerBlur = (toDo: Todo) => {
    editingTodo(toDo);
  };

  const handleEdditing = (toDo: Todo) => {
    setToggleDoubleClick(toDo);
    setEditTodoTitle(toDo.title);
  };

  const onKeyPressHandler = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setToggleDoubleClick(null);
    }
  };

  const activeTodoLoader = (isLoading && isLoading.id === todo.id)
  || (!todo.id)
  || (loadingAllTodos)
  || (clearLoader && todo.completed);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={
        classNames('todo', {
          completed: todo.completed,
        })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => selectComplited(todo)}
        />
      </label>

      {toggleDoubleClick !== todo && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEdditing(todo)}
        >
          {todo.title}
        </span>
      )}

      {toggleDoubleClick === todo && (
        <form
          onSubmit={() => editingTodo(todo)}
        >
          <input
            data-cy="TodoTitle"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editTitle}
            value={editTodoTitile}
            onBlur={() => handlerBlur(todo)}
            onChange={event => setEditTodoTitle(event.target.value)}
            onKeyDown={onKeyPressHandler}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': activeTodoLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo)}
      >
        { toggleDoubleClick !== todo && (
          '×'
        )}
      </button>
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => Promise<unknown>,
  updatedTodo: (newTodo: Todo) => Promise<unknown>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updatedTodo,
}) => {
  const [editValue, setEditValue] = useState(todo.title);
  const [editTodosId, setEditTodosId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { todos, setTodos, USER_ID } = useContext(TodosContext);

  useEffect(() => {
    if (editTodosId === todo.id) {
      inputRef.current?.focus();
    }
  }, [editTodosId, todo.id]);

  const updateTitle = (newTitle: string) => {
    if (!newTitle) {
      deleteTodo(todo.id);
      setEditTodosId(0);
    } else {
      const newTodo: Todo = {
        id: todo.id,
        title: newTitle,
        userId: USER_ID,
        completed: todo.completed,
      };

      const newTodos = [...todos];
      const index = newTodos.findIndex(currentTodo => (
        currentTodo.id === newTodo.id));

      newTodos.splice(index, 1, newTodo);

      updatedTodo(newTodo)
        .then(() => {
          setTodos(newTodos);
          setEditTodosId(0);
        });
    }
  };

  const updatedComplete = () => {
    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    };

    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => (
      currentTodo.id === newTodo.id));

    newTodos.splice(index, 1, newTodo);

    updatedTodo(newTodo)
      .then(() => setTodos(newTodos));
  };

  const handlePressEnterEdit
    = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        updateTitle(editValue.trim());
      }
    };

  const handleOnblurEdit = () => {
    updateTitle(editValue.trim());
  };

  const handleChangeEditValue
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(event.target.value);
    };

  const handleDeleteBtn = () => {
    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => currentTodo.id === todo.id);

    newTodos.splice(index, 1);

    deleteTodo(todo.id)
      .then(() => setTodos(newTodos));
  };

  return (
    <div
      className={cn('todo',
        { completed: todo.completed },
        { editing: editTodosId === todo.id })}
      onDoubleClick={() => setEditTodosId(todo.id)}
      data-cy="Todo"
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${todo.id}`}
          onChange={updatedComplete}
          checked={todo.completed}
        />
      </label>

      {
        editTodosId !== todo.id ? (
          <>
            <label data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </label>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteBtn}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editValue}
              onChange={handleChangeEditValue}
              onBlur={handleOnblurEdit}
              ref={inputRef}
              onKeyPress={handlePressEnterEdit}
            />
          </form>
        )
      }

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

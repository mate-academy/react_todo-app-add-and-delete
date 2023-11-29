/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext/TodosContext';

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
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id)
        .then(() => {
          const newTodos = todos.filter((t) => t.id !== todo.id);

          setTodos(newTodos);
          setEditTodosId(0);
        });
    } else {
      const newTodo: Todo = {
        id: todo.id,
        title: trimmedTitle,
        userId: USER_ID,
        completed: todo.completed,
      };

      const newTodos = [...todos];
      const index = newTodos.findIndex(
        currentTodo => currentTodo.id === newTodo.id,
      );

      newTodos.splice(index, 1, newTodo);
      updatedTodo(newTodo).then(() => {
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
      currentTodo.id === newTodo.id
    ));

    newTodos.splice(index, 1, newTodo);

    updatedTodo(newTodo)
      .then(() => setTodos(newTodos));
  };

  const handlePressKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      updateTitle(editValue.trim());
    } else if (event.key === 'Escape') {
      setEditValue(todo.title.trim());
      setEditTodosId(0);
    }
  };

  const handleOnBlueEditValue = () => {
    updateTitle(editValue.trim());
  };

  const handleChangeEditValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditValue(event.target.value);
  };

  const handleDeleteValue = () => {
    const newTodos = todos.filter(currentTodo => currentTodo.id !== todo.id);

    deleteTodo(todo.id)
      .then(() => setTodos(newTodos));
  };

  const handleDoubleClick = () => {
    setEditTodosId(todo.id);
    setEditValue(todo.title.trim());
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed },
        { editind: editTodosId === todo.id })}
      onDoubleClick={handleDoubleClick}
    >
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

      {editTodosId !== todo.id ? (
        <>
          <label data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </label>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteValue}
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
            onBlur={handleOnBlueEditValue}
            ref={inputRef}
            onKeyDown={handlePressKey}
          />
        </form>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

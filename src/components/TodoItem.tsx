/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useState, useRef, useContext,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContex';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<unknown>;
  updatedTodo: (newTodo: Todo) => Promise<unknown>;
};

const TodoItem: React.FC<Props> = ({ todo, deleteTodo, updatedTodo }) => {
  const [editValue, setEditValue] = useState(todo.title);
  const [editTodosId, setEditTodosId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { todos, setTodos, USER_ID } = useContext(TodoContext);

  const updateTitle = (newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleDeleteTodo();
    } else {
      handleUpdateTodo({
        id: todo.id,
        title: trimmedTitle,
        userId: USER_ID,
        completed: todo.completed,
      });
    }
  };

  const handleDeleteTodo = () => {
    const newTodos = todos.filter(currentTodo => currentTodo.id !== todo.id);

    deleteTodo(todo.id).then(() => setTodos(newTodos));
  };

  const handleUpdateTodo = (newTodo: Todo) => {
    const newTodos = todos.map(currentTodo => (
      currentTodo.id === newTodo.id ? newTodo : currentTodo
    ));

    updatedTodo(newTodo).then(() => setTodos(newTodos));
    setEditTodosId(null);
  };

  const handleToggleEdit = () => {
    setEditTodosId(todo.id);
  };

  const handleToggleComplete = () => {
    const newTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    handleUpdateTodo(newTodo);
  };

  const handleKeyPressEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTitle(editValue);
    }
  };

  const handleBlurEdit = () => {
    updateTitle(editValue);
  };

  const handleChangeEditValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditValue(event.target.value);
  };

  return (
    <div
      className={
        cn(
          'todo',
          { completed: todo.completed },
          { editing: editTodosId === todo.id },
        )
      }
      onDoubleClick={handleToggleEdit}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${todo.id}`}
          onChange={handleToggleComplete}
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
            onClick={handleDeleteTodo}
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
            onBlur={handleBlurEdit}
            ref={inputRef}
            onKeyPress={handleKeyPressEdit}
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

export default TodoItem;

import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodosContext } from './TodoContext';
import { deleteTodos } from './api/todos';

type Props = {
  currentTodo: Todo,
};

export const TodoCard: React.FC<Props> = ({ currentTodo }) => {
  const {
    todos,
    setTodos,
    isMouseEnter,
    setIsMouseEnter,
    setIsDeleteError,
  } = useContext(TodosContext);

  const findTodo = (todo: Todo) => {
    return todos.findIndex(el => el.id === todo.id);
  };

  const remove = async () => {
    setIsDeleteError(false);

    try {
      const response = await deleteTodos(currentTodo.id);

      if (response !== 0) {
        setTodos(
          todos.filter(todo => todo.id !== currentTodo.id),
        )
      } else {
        setIsDeleteError(true)
      }
    } catch {
      setIsDeleteError(true);
    }
  };

  return (
    <div
      className={classNames(
        'todo', { completed: todos[findTodo(currentTodo)].completed },
      )}
      key={currentTodo.title}
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todos[findTodo(currentTodo)].completed}
          onChange={() => {
            setTodos(
              [...todos.slice(0, findTodo(currentTodo)),
                {
                  ...currentTodo,
                  completed: !todos[findTodo(currentTodo)].completed,
                },
                ...todos.slice(findTodo(currentTodo) + 1)],
            );
          }}
        />
      </label>

      <span className="todo__title">{currentTodo.title}</span>

      {isMouseEnter && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => remove()}
        >
          ×
        </button>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

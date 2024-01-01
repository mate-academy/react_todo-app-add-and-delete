/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useTodo } from '../providers/TodoProvider';
import { TodoInfo } from './TodoInfo';
import { TodoEdit } from './TodoEdit';

export const TodoList = () => {
  const {
    visibleTodos,
    setTodos,
    modifiedTodo,
    setModifiedTodo,
  } = useTodo();

  const handleDoubleClick = (todoId: number | null = null) => () => {
    setModifiedTodo(todoId);
  };

  const handleCheck = (todoId: number) => () => {
    setTodos(prev => (
      prev.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      })
    ));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
            onDoubleClick={handleDoubleClick(todo.id)}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={handleCheck(todo.id)}
              />
            </label>

            {todo.id !== modifiedTodo
              ? <TodoInfo todo={todo} />
              : <TodoEdit todoTitle={todo.title} />}

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
              ×
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

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
    deleteTodoFromApi,
    tempTodo,
    isDeleting,
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

  const handleDelete = (todoId: number) => () => {
    deleteTodoFromApi(todoId);
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
              onClick={handleDelete(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isDeleting.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className="todo"
          onDoubleClick={handleDoubleClick(tempTodo.id)}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={handleCheck(tempTodo.id)}
            />
          </label>

          {tempTodo.id !== modifiedTodo
            ? <TodoInfo todo={tempTodo} />
            : <TodoEdit todoTitle={tempTodo.title} />}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete(tempTodo.id)}
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

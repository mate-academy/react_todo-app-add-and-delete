import cn from 'classnames';
import { Todo } from '../types/type';
import { deleteTodos } from '../api/todos';
import { useContext } from 'react';
import { InitialTodosContext, TodosContext } from '../store';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { dispatch } = useContext(TodosContext);
  const { setInitialTodos } = useContext(InitialTodosContext);

  const removeTodo = (todo: Todo) => {
    deleteTodos(todo.id);

    dispatch({ type: 'REMOVE_TODO', payload: todo.id });
    setInitialTodos(prevState =>
      prevState.filter(state => state.id !== todo.id),
    );
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {
        todo.isLoading ? (
          <div data-cy="TodoLoader" className="loader">Loading...</div>
        ) : (
          <>
            <label className="todo__status-label" htmlFor={`${todo.id}`}>
              <input
                data-cy="TodoStatus"
                type="checkbox"
                id={`${todo.id}`}
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => removeTodo(todo)}
            >
              ×
            </button>
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )
      }

    </div >
  );
};

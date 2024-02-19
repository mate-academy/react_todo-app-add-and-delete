import cn from 'classnames';
import { useContext } from 'react';
import { deleteTodo } from '../api/todos';
import { DispatchContext, StateContext } from './TodosContext';
import { Todo } from '../Types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const { loading } = useContext(StateContext);
  const isLoading = loading.todoIds.includes(todo.id);

  const handleRemoveTodo = (id: number) => {
    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: [id] },
    });

    deleteTodo(id)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }));
  };

  const handleChandeTodo = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    dispatch({ type: 'changeTodo', payload: updatedTodo });
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo${todo.completed ? ' completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={handleChandeTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

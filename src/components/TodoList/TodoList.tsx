import { useContext, useState } from 'react';
import classnames from 'classnames';

import { getFilteredTodos } from '../../utils/utils';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../context/TodoContext';
import { FilterContext } from '../../context/FilterContext';
import { TodoTempContext } from '../../context/TodoTempContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../../context/ErrorContext';

type Props = {
  isActive: boolean;
};

export const TodoList: React.FC<Props> = ({
  isActive,
}) => {
  const { todos, setTodos } = useContext(TodoContext);
  const { selectedFilter } = useContext(FilterContext);
  const { todoTemp } = useContext(TodoTempContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const filteredTodos = getFilteredTodos(todos, selectedFilter);

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(({ id }) => id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          isLoading={isLoading}
        />
      ))}

      {todoTemp && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todoTemp?.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classnames(
              'modal overlay', {
                'is-active': isActive,
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

import { FC } from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '../helpers/getEnumKeys';
import { TodoStatus } from '../types/TodoStatus';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { todosApi } from '../api/todos-api';
import { useErrorContext } from '../context/errorContext/useErrorContext';

interface TodoContentFooterProps {
  selectedStatusTodo: TodoStatus,
  onSelectStatusTodo: (status: TodoStatus) => void
}

export const TodoContentFooter: FC<TodoContentFooterProps> = (props) => {
  const {
    selectedStatusTodo,
    onSelectStatusTodo,
  } = props;

  const { todos, setRemovingTodoIds } = useTodoContext();
  const { notifyAboutError } = useErrorContext();
  const { size, countCompleted, removeCompletedTodos } = useTodoContext();
  const statusKeys = getEnumKeys(TodoStatus);

  const onRemoveCompletedTodos = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    setRemovingTodoIds(ids);

    try {
      const result = await todosApi.removeCompleted(ids);

      if (result) {
        removeCompletedTodos(ids);
      }
    } catch {
      notifyAboutError('Unable to delete a todo');
    } finally {
      setRemovingTodoIds([]);
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${size} items left`}
      </span>

      <nav className="filter">
        {statusKeys.map(status => (
          <a
            href="#/"
            className={classNames(
              'filter__link',
              {
                selected: selectedStatusTodo === status,
              },
            )}
            key={status}
            onClick={() => onSelectStatusTodo(TodoStatus[status])}
          >
            {status}
          </a>
        ))}
      </nav>

      {countCompleted > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

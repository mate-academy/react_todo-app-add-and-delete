import classNames from 'classnames';
import { Links } from '../../utils/enum';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  filteredBy: string;
  todosLengh: number;
  handleChange: (value: string) => void;
  todos: Todo[];
  setTodoList: (todos: Todo[]) => void;
  setErrorMessage: (value: string) => void;
  setDeletedTodos: (value: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  filteredBy,
  todosLengh,
  handleChange,
  todos,
  setTodoList,
  setErrorMessage,
  setDeletedTodos,
}) => {
  const handleDeleteAllCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const incompletedTodos = todos.filter(todo => !todo.completed);
    const completedTodosID = todos.map(todo => {
      if (todo.completed) {
        return todo.id;
      }

      return 0;
    });

    completedTodos.forEach(async todo => {
      try {
        setDeletedTodos([...completedTodosID]);
        await deleteTodo(`/todos/${todo.id}`).then(() => {
          setTodoList(incompletedTodos);
        });
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setDeletedTodos([]);
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todosLengh} items left`}</span>

      <nav className="filter">
        {Object.keys(Links).map((key) => (
          <a
            href="#/completed"
            className={classNames('filter__link',
              {
                selected: filteredBy === key,
              })}
            key={key}
            onClick={() => handleChange(key)}
          >
            {key}
          </a>
        ))}
      </nav>

      {todos.some((todo) => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleDeleteAllCompletedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

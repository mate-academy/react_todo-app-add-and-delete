import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, deleteTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../utils/ErrorMessage';
import { FilteringMode } from '../utils/FilteringMode';

interface Props {
  todos: Todo[] | null,
  filteringMode: FilteringMode,
  userId: number,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todosToBeDeleted: Todo['id'][] | null,
  setTodosToBeDeleted: React.Dispatch<React.SetStateAction<number[] | null>>,
}

let filteredTodos: Todo[] | null = [];

export const TodoList: React.FC<Props> = ({
  todos, filteringMode, userId, setTodos, todosToBeDeleted, setTodosToBeDeleted,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (filteringMode !== FilteringMode.all && todos !== null) {
    switch (filteringMode) {
      case FilteringMode.active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case FilteringMode.completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
    }
  } else {
    filteredTodos = todos;
  }

  const setError = useContext(SetErrorContext);

  const handleSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      if (todoTitle) {
        setProcessing(true);
        setTempTodo({
          title: todoTitle,
          completed: false,
          userId,
          id: 0,
        });
        addTodo({
          title: todoTitle,
          completed: false,
          userId,
        })
          .then((response) => {
            setProcessing(false);
            setTempTodo(null);
            todos?.push(response);
          })
          .catch(() => setError?.(ErrorMessage.CantAdd));

        setTodoTitle('');
      } else {
        setError?.(ErrorMessage.EmptyTitle);
      }
    }
  };

  const handleDeletion = (todoId: number) => {
    if (todos) {
      setTodosToBeDeleted([todoId]);
      deleteTodo(todoId)
        .then(() => {
          const deletedId = todos?.findIndex(todo => todo.id === todoId);
          const splicedTodos = [...todos];

          splicedTodos?.splice(deletedId, 1);
          setTodos(splicedTodos);
          setTodosToBeDeleted(null);
        })
        .catch(() => {
          setTodosToBeDeleted(null);
          setError?.(ErrorMessage.CantDelete);
        });
    }
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Toggle all"
        />

        <form>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            onKeyDown={handleSubmit}
            disabled={processing}
          />
        </form>
      </header>

      <section className="todoapp__main">
        {filteredTodos?.map(({
          id, title, completed,
        }) => (
          <div
            className={cn({
              todo: true,
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={completed}
              />
            </label>

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeletion(id)}
            >
              ×
            </button>

            <div className={
              todosToBeDeleted?.includes(id)
                ? 'modal overlay is-active'
                : 'modal overlay'
            }
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo
        && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

      </section>
    </>
  );
};

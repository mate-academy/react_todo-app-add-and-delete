import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';

interface Props {
  todos: Todo[] | null,
  filteringMode: string,
  userId: number,
}

let filteredTodos: Todo[] | null = [];

export const TodoList: React.FC<Props> = ({
  todos, filteringMode, userId,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (filteringMode !== 'all' && todos !== null) {
    switch (filteringMode) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
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
          .catch(() => setError?.('cantadd'));
        // #TODO: get rid of the nasty ?. somehow

        setTodoTitle('');
      } else {
        setError?.('emptytitle');
        // #TODO: get rid of the nasty ?. somehow
      }
    }
  };

  return (
    <>
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Toggle all"
        />

        {/* Add a todo on form submit */}
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
        {filteredTodos?.map(todo => (
          <div
            className={cn({
              todo: true,
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay">
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

        {/* This todo is being edited */}
        {/* <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div> */}

        {/* This todo is in loadind state */}

      </section>
    </>
  );
};

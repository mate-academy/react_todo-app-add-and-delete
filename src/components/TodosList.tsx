import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodoHandler: (value: number) => void,
  selectedTodoId: number,
  setSelectedTodoId: (value: number) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodoHandler,
  selectedTodoId,
  setSelectedTodoId,
}) => {
  const deleteButtonHandler = (id: number) => {
    deleteTodoHandler(id);
    setSelectedTodoId(id);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteButtonHandler(todo.id)}
              >
                ×
              </button>

              <div
                className={
                  classNames(
                    'modal overlay',
                    { 'is-active': todo.id === selectedTodoId },
                  )
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {!!tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              className={classNames('todo', { completed: tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>

              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

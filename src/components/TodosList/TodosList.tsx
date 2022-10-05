import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onRemoveTodo: (id: number) => void,
  isTodoLoaded: boolean,
  title: string,
  selectedTodos: number[],
  setSelectedTodos: (num: number[]) => void,
  onUpdate: (todoId: number, data: Partial<Todo>) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  isTodoLoaded,
  title,
  selectedTodos,
  setSelectedTodos,
  onUpdate,
}) => {
  const temp = {
    id: 0,
    title,
  };

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={350}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              onRemoveTodo={onRemoveTodo}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {isTodoLoaded
          && (
            <CSSTransition
              key={0}
              timeout={350}
              classNames="temp-item"
            >
              <div
                data-cy="Todo"
                className={classNames(
                  'todo',
                  { completed: isTodoLoaded },
                )}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {temp.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
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

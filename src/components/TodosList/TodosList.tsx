import classnames from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  onDelete: (todoId: number) => void;
  selectedTodos: number[];
};

export const TodosList: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  onDelete,
  selectedTodos,
}) => {
  const temp = {
    id: 0,
    title,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              selectedTodos={selectedTodos}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={500}
            classNames="item"
          >
            <div
              data-cy="Todo"
              className="todo"
              key={temp.id}
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
              <div
                data-cy="TodoLoader"
                className={classnames(
                  'modal overlay',
                  { 'is-active': isAdding },
                )}
              >
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

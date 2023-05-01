import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/animation.scss';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number) => void;
  todosTransform: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  todosTransform,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemove={onRemove}
              todosTransform={todosTransform}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              className="todo"
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

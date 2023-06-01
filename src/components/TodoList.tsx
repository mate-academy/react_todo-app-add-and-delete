import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import '../styles/animations.css';

interface TodoListProps {
  visibleTodos: TodoType[];
  onTodoRemove: (id: string) => void;
  tempTodo: TodoType | null;
  isLoading: string[];
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onTodoRemove,
  tempTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <Todo
              todo={todo}
              key={todo.id}
              onTodoRemove={onTodoRemove}
              isLoading={isLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>
              <div className={cn('modal overlay',
                { 'is-active': tempTodo !== null })}
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

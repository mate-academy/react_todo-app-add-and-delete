import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
  activeTodoId: number | null;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  activeTodoId,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"

          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              activeTodoId={activeTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              removeTodo={removeTodo}
              activeTodoId={activeTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

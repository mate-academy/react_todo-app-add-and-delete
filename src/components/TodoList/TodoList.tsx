import { FC } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onTodoDelete: (todoId: number) => void;
  loadingTodosId: number[],
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  loadingTodosId,
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
            <TodoInfo
              key={todo.id}
              todo={todo}
              onDelete={onTodoDelete}
              loadingTodosId={loadingTodosId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              onDelete={onTodoDelete}
              loadingTodosId={loadingTodosId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

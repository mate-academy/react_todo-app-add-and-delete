import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';

type Props = {
  todos: Todo[],
  isAdding?: boolean,
  newTodo?: Todo,
  onItemRemove: (todoId: number) => void,
  loadingTodos: number[],
};

export const TodoList:FC<Props> = ({
  todos,
  isAdding,
  newTodo,
  onItemRemove,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={3000}
            classNames="item"
          >
            <TodoComponent
              key={todo.id}
              todo={todo}
              onRemove={onItemRemove}
              isLoading={loadingTodos.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {isAdding && newTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoComponent
              todo={newTodo}
              isLoading={isAdding}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

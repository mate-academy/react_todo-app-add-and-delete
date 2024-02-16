import { memo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodos: (id: number) => void,
  deleteTodosId: number | null,
}

export const TodoList: React.FC<Props> = memo(({
  todos, tempTodo, deleteTodos, deleteTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(({ title, completed, id }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              title={title}
              completed={completed}
              id={id}
              key={id}
              deleteTodos={deleteTodos}
              isLoading={deleteTodosId === id}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            title={tempTodo.title}
            completed={false}
            id={tempTodo.id}
            deleteTodos={deleteTodos}
            isLoading
          />
        </CSSTransition>
      )}
    </section>
  );
});

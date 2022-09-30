import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
  isAdding: boolean,

}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {
          todos.map((todo) => (
            <CSSTransition
              key={todo.id}
              timeout={500}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                removeTodo={removeTodo}
                selectedId={selectedId}
              />
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    </section>
  );
};

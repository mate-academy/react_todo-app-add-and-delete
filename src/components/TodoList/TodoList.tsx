import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodosIds: number[];
  newTitle: string;
  isAdding: boolean;
  onDelete: (id: number) => Promise<void>,
};

export const TodosList: React.FC<Props> = ({
  todos,
  selectedTodosIds,
  newTitle,
  isAdding,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              isAdding={isAdding}
              selectedTodosIds={selectedTodosIds}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={Math.random()}
              todo={{
                id: 0,
                title: newTitle,
                completed: false,
                userId: Math.random(),
              }}
              selectedTodosIds={selectedTodosIds}
              isAdding={isAdding}
              onDelete={onDelete}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

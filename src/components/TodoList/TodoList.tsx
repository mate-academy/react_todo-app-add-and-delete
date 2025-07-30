import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              id={todo.id}
              completed={todo.completed}
              title={todo.title}
              loading={loadingTodoIds.includes(todo.id)}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem, TodoItemProps } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
} & Pick<TodoItemProps, 'isLoading' | 'onDelete'>;

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  isLoading,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} isLoading={isLoading} onDelete={onDelete} />
          </CSSTransition>
        ))}
        {tempTodo && tempTodo.id === 0 && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={isLoading}
              onDelete={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

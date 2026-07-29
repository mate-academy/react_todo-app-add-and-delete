import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  handleDelete: (id: number) => void;
  deletingTodoId: number | null;
};

export const TodoList = ({
  todos,
  tempTodo,
  isAdding,
  handleDelete,
  deletingTodoId,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              handleDelete={handleDelete}
              isLoading={todo.id === deletingTodoId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={isAdding} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

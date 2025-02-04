import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  temporaryTodo: Todo | null;
  deleteTask: (todoIds: number[]) => void;
  isLoading: boolean;
  pendingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  temporaryTodo,
  isLoading,
  deleteTask,
  pendingIds,
}) => {
  const renderTodoItem = (todo: Todo, isTemporary = false) => (
    <CSSTransition
      key={todo.id}
      timeout={300}
      classNames={isTemporary ? 'temp-item' : 'item'}
    >
      <TodoItem
        todo={todo}
        handleDeleteTodo={deleteTask}
        isLoading={isTemporary ? isLoading : false}
        pendingIds={pendingIds}
      />
    </CSSTransition>
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => renderTodoItem(todo))}

        {temporaryTodo && renderTodoItem(temporaryTodo, true)}
      </TransitionGroup>
    </section>
  );
};

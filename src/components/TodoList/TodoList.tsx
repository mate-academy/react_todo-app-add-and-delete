import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onRemoveTodo: (todo: Todo) => void;
  onToogleTodo: (todo: Todo) => void;
  onHandleUpdate: (todo: Todo) => void;
  todosLoadingState: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onToogleTodo,
  onHandleUpdate,
  todosLoadingState,
}) => {
  return (
    <ul className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              key={todo.id}
              todosLoadingState={todosLoadingState}
              onRemoveTodo={onRemoveTodo}
              onToogleTodo={onToogleTodo}
              onHandleUpdate={onHandleUpdate}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ul>
  );
};

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/transitionList.scss';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (todoId: number) => void,
  processings: number[],
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDelete, processings,
}) => {
  return (
    <TransitionGroup>
      <section className="todoapp__main">
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              isProcessed={processings.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
              isProcessed
            />
          </CSSTransition>
        )}
      </section>
    </TransitionGroup>
  );
};

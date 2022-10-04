import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import '../../styles/transitionGroup.scss';

type Props = {
  todos: Todo[],
  onDelete: (todo: number) => void
  isAdding: boolean
  newTodoTitle: string
};

export const TodoList: React.FC<Props> = ({
  todos, onDelete, isAdding, newTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              title={todo.title}
              completed={todo.completed}
              onDelete={onDelete}
              todo={todo}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              title={newTodoTitle}
              completed={false}
              key={0}
              onDelete={onDelete}
              isAdding={isAdding}
              todo={{
                title: newTodoTitle,
                completed: false,
                id: 0,
                userId: 0,
              }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

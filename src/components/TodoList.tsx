import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos : Todo[],
  removeTodo: (value: number) => void,
  tempTodo: Todo | null,
  loadingTodo: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  loadingTodo,
}) => {
  const listItems = todos.map(todo => (
    <CSSTransition
      key={todo.id}
      timeout={300}
      classNames="item"
    >
      <li key={todo.id}>
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      </li>

    </CSSTransition>
  ));

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        <ul>
          {listItems}

          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                removeTodo={removeTodo}
                loadingTodo={loadingTodo}
              />
            </CSSTransition>
          )}
        </ul>
      </TransitionGroup>
    </section>
  );
};

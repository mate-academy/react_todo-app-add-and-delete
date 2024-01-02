import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';
import { useTodos } from '../../context';

export const TodoList = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useTodos();

  return (
    <>
      {filteredTodos.length > 0 && (
        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          <TransitionGroup>
            {filteredTodos.map((todo: Todo) => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem key={todo.id} todo={todo} />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem key={tempTodo.id} todo={tempTodo} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>
      )}
    </>
  );
};

export default TodoList;

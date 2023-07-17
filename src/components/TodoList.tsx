import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodoContext } from '../hooks/useTodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const {
    todos,
    tempTodo,
    processed,
  } = useTodoContext();

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            timeout={300}
            classNames="item"
            key={todo.id}

          >
            <TodoItem
              todo={todo}
              onProcessed={processed.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo
          && (
            <CSSTransition
              timeout={300}
              classNames="temp-item"
              key={tempTodo.id}
            >
              <TodoItem todo={tempTodo} onProcessed />
            </CSSTransition>
          )}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;

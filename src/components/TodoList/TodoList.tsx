import { TransitionGroup, CSSTransition } from 'react-transition-group';
import TodoItem from './TodoItem';
import '../../styles/transitions.scss';
import { useTodoContext } from '../../context/TodoContext';

export const TodoList = () => {
  const {
    filteredTodos, tempTodo, loadingTodoId, removeTodo, updateTodo,
  } = useTodoContext();

  return (
    <TransitionGroup>

      {filteredTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            isLoading={loadingTodoId.includes(todo.id)}
            updateTodo={updateTodo}
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
            key={tempTodo.id}
            todo={tempTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
            isLoading
          />
        </CSSTransition>
      )}

    </TransitionGroup>
  );
};

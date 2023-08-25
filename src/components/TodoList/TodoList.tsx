import { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodosContext } from '../../TodosContext';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(TodosContext);

  return (
    <TransitionGroup>
      {filteredTodos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="todo-item">
          <TodoItem todo={todo} />
        </CSSTransition>
      ))}

      {!!tempTodo && (
        <CSSTransition timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

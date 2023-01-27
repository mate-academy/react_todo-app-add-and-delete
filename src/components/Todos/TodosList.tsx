import {
  useContext, useEffect, useRef,
} from 'react';
import autoAnimate from '@formkit/auto-animate';
import { TodoInfo } from './TodoInfo';
import { TodosContext } from './TodosContext';

export const TodosList = () => {
  const {
    todos,
    setTodos,
    setErrors,
    filterType,
    pendingTodos,
    setPendingTodos,
  } = useContext(TodosContext);
  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, [parentRef]);

  const filteredTodos = todos.filter(item => {
    switch (filterType) {
      case 'all':
        return true;
      case 'completed':
        return item.completed;
      case 'active':
        return !item.completed;
      default:
        return true;
    }
  });

  return (
    <section ref={parentRef} className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setErrors={setErrors}
          pending={pendingTodos.includes(todo.id) || todo.id === 0}
          setPendingTodos={setPendingTodos}
        />
      ))}
    </section>
  );
};

import { useEffect } from 'react';
import { useTodoContext } from '../context';
import { TodoInfo } from './TodoInfo';
import { TodoFooter } from './TodoFooter';

export const TodoList = () => {
  const {
    visibleTodos,
    setVisibleTodos,
    allTodos,
    inputRef,
    tempTodo,
  } = useTodoContext();

  useEffect(() => {
    setVisibleTodos(allTodos);
  }, [allTodos, setVisibleTodos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [allTodos, inputRef]);

  return (
    <>
      {visibleTodos?.map(todo => (
        <TodoInfo todo={todo} />
      ))}
      {tempTodo
        && (
          <TodoInfo todo={tempTodo} />
        )}
      {allTodos && allTodos.length > 0
        && (
          <TodoFooter />
        )}
    </>
  );
};

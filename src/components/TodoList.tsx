import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../context/todosContext';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
}

export const TodoList:React.FC<Props> = ({ todos }) => {
  const {
    tempTodo,
  } = useContext(TodosContext);

  return (
    <section
      className={cn('todoapp__main', {
        hidden: todos.length === 0,
      })}
    >
      {todos.map(todo => (
        <React.Fragment key={todo.id}>
          <TodoItem todo={todo} />
        </React.Fragment>
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};

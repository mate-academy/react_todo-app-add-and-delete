import React, { useContext } from 'react';
import TodoItem from '../TodoItem/TodoItem';
import { getFiltredTodoList } from '../Footer/service';
import { MainContext } from '../../ContextProvider/ContextProvider';

const TodoList: React.FC = () => {
  const context = useContext(MainContext);
  const { todos, filter, tempTodo } = context;

  const filtredTodoList = tempTodo
    ? [...getFiltredTodoList(filter, todos), tempTodo]
    : getFiltredTodoList(filter, todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodoList.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};

export default TodoList;

import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface List {
  tempTodo: Todo | null;
  todos: Todo[];
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  handleTodoDelete: (usersId: number) => void;
  arrTodos: number[];
  delLoader: number | null;
}

export const TodoList: React.FC<List> = ({
  tempTodo,
  todos,
  controlChecked,
  setControlChecked,
  setTodoItem,
  handleTodoDelete,
  arrTodos,
  delLoader,
}) => {
  return (
    <>
      {tempTodo && (
        <TodoItem
          tempTodo={tempTodo}
          controlChecked={controlChecked}
          setControlChecked={setControlChecked}
          setTodoItem={setTodoItem}
          handleTodoDelete={handleTodoDelete}
          arrTodos={arrTodos}
          delLoader={delLoader}
        />
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          tempTodo={todo}
          controlChecked={controlChecked}
          setControlChecked={setControlChecked}
          setTodoItem={setTodoItem}
          handleTodoDelete={handleTodoDelete}
          arrTodos={arrTodos}
          delLoader={delLoader}
        />
      ))}
    </>
  );
};

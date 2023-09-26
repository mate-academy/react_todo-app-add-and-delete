import React from 'react';
import { TodoElement } from '../Todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void
  tempTodo: Todo | null
  setErrorMessage: (message: string) => void
  loadingItems: number[]
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setErrorMessage,
  loadingItems,
  setLoadingItems,
}) => {
  const handleTodoStatusChange = (id: number | undefined) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoElement
            todo={todo}
            handleTodoStatusChange={handleTodoStatusChange}
            key={todo.id}
            setErrorMessage={setErrorMessage}
            removeTodo={removeTodo}
            setLoadingItems={setLoadingItems}
            loadingItems={loadingItems}
          />
        );
      })}
      {tempTodo !== null && (
        <TodoElement
          todo={tempTodo}
          handleTodoStatusChange={handleTodoStatusChange}
          setLoadingItems={setLoadingItems}
          loadingItems={loadingItems}
        />
      )}
    </section>
  );
};

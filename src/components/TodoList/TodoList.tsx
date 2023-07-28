import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { DeleteModalContext } from '../../context/DeleteModalContext';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  deleteTodo,
}) => {
  const { setDeleteModal } = useContext(DeleteModalContext);

  const updateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const { checked } = event.target;

    setTodos((prevState: Todo[]) => {
      return prevState.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: checked,
          };
        }

        return todo;
      });
    });
  };

  const clearTodo = (todo: Todo) => {
    setDeleteModal([todo.id]);
    removeTodo(todo.id)
      .then(() => deleteTodo(todo.id))
      .catch(() => 'Unable to delete todo')
      .finally(
        () => setDeleteModal([]),
      );
  };

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updateTodo}
          clearTodo={clearTodo}
        />
      ))}
    </ul>
  );
};

import { FC, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { deleteTodo } from '../api/todos';
import { useDispatch, useSelector } from '../providers/TodosContext';

type Props = {
  todos: Todo[]
};

export const TodosList: FC<Props> = ({ todos }) => {
  const { updateTodos, tempTodo } = useSelector();
  const dispatch = useDispatch();

  const [inProcess, setInProcess] = useState<number[]>([]);

  const handleDelete = (id: number) => {
    setInProcess(prev => [...prev, id]);

    deleteTodo(id)
      .then(updateTodos)
      .catch(() => dispatch({
        type: 'setError',
        payload: {
          isError: true,
          errorMessage: 'Unable to delete a todo',
        },
      }))
      .finally(() => {
        setInProcess(prev => {
          const idx = prev.findIndex((todoId) => todoId === id);

          return [...prev].splice(idx, 1);
        });
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          inProcess={inProcess.includes(todo.id)}
          onDelete={handleDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          inProcess
          onDelete={() => { }}
        />
      )}
    </section>
  );
};

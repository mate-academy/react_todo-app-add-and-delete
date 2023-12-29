import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { deleteTodo } from '../api/todos';
import { useDispatch, useSelector } from '../providers/TodosContext';

type Props = {
  todos: Todo[]
};

export const TodosList: FC<Props> = ({ todos }) => {
  const { updateTodos, tempTodo, inProcess } = useSelector();
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    dispatch({ type: 'setInProcess', payload: [...inProcess, id] });

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
        const idx = inProcess.findIndex((todoId) => todoId === id);

        dispatch({
          type: 'setInProcess',
          payload: [...inProcess].splice(idx, 1),
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

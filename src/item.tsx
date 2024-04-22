/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from './types/Todo';
import { ContextTodos } from './TodoContext';
import cn from 'classnames';

import { Title } from './Title';
import { Form } from './Form';
import { Loader } from './Loader';
import { useContext } from 'react';
import { patchTodo } from './api/todos';

type Props = {
  todo: Todo;
};

export const Item = ({ todo }: Props) => {
  const {
    isEdited,
    editSelectedInput,
    setIsLoading,
    setVisibleErr,
    setErrMessage,
    resetErr,
    setTodos,
    todos,
  } = useContext(ContextTodos);
  const updateTodo = async (updatedTodo: Todo) => {
    try {
      setIsLoading([updatedTodo.id]);
      const todoToUpdate = todos.find(tod => tod.id === updatedTodo.id);

      let newTodo: Todo = {
        id: 0,
        userId: 0,
        title: '',
        completed: false,
      };

      if (todoToUpdate) {
        newTodo = { ...todoToUpdate, completed: !updatedTodo.completed };
      }

      await patchTodo(newTodo).then(response =>
        setTodos(prevState => {
          const updatedTodos = [...prevState];

          const findTodoIndex = updatedTodos.findIndex(
            t => t.id === response.id,
          );

          if (findTodoIndex !== -1) {
            updatedTodos[findTodoIndex] = response;
          } else {
            updatedTodos.push(response);
          }

          return updatedTodos;
        }),
      );
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to update a todo');
      resetErr();
    } finally {
      setIsLoading([]);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo)}
        />
      </label>
      {isEdited !== todo.id && <Title todo={todo} />}
      {isEdited === todo.id && (
        <Form todo={todo} editSelectedInput={editSelectedInput} />
      )}

      <Loader todoId={todo.id} />
    </div>
  );
};

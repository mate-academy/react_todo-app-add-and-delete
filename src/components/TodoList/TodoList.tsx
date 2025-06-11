import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props {
  todoList: Todo[];
  tempTodo: Todo | null;
  deletedTodo: number[];
  setTodoData: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDeletedTodo: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: (value: ErrorMessages) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  todoList,
  tempTodo,
  deletedTodo,
  setTodoData,
  setDeletedTodo,
  setErrorMessage,
  inputRef,
}) => {
  const handleDelete = (id: number) => {
    setDeletedTodo(cur => [...cur, id]);

    deleteTodo(id)
      .then(() => setTodoData(cur => cur.filter(todo => todo.id !== id)))
      .catch(() => setErrorMessage(ErrorMessages.OnDelete))
      .finally(() => {
        setDeletedTodo(cur => cur.filter(curId => curId !== id));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleSwitchStatus = (currentId: number) => {
    setTodoData(current =>
      current.map(todo =>
        todo.id === currentId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    // if (false) {
    //   createErrorMessage(ErrorMessages.OnPatch);
    // }
  };

  // const handleUpdate = () => {
  //   if (false) {
  //     createErrorMessage(ErrorMessages.OnPatch);
  //   }

  //   patchTodo();
  // };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map((todo: Todo) => {
        const isOverlayActive = deletedTodo.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isOverlayActive={isOverlayActive}
            handleDelete={handleDelete}
            handleSwitchStatus={handleSwitchStatus}
          />
        );
      })}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};

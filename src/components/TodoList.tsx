/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { ErrorMessage, FilteredStatus, Todo } from '../types/Todo';
import { TempTodo } from './TempTodo/TempTodo';
import { deleteTodos } from '../api/todos';
import { TodoItem } from './TodoItem.tsx/TodoItem';

interface Props {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  setCount: (value: number) => void;
  filterValue: FilteredStatus;
  onInputChange: () => void;
  tempTodo: Todo | null;
  setErrorMessage: (value: ErrorMessage) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  deletedTodoId: number[];
  setDeletedTodoId: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoList = ({
  todos,
  setTodos,
  setCount,
  filterValue,
  onInputChange,
  tempTodo,
  setErrorMessage,
  inputRef,
  deletedTodoId,
  setDeletedTodoId,
}: Props) => {
  useEffect(() => {
    const incompleteCount = todos.filter(todo => !todo.completed).length;

    setCount(incompleteCount);
  }, [todos, setCount]);

  const filteredTodos = todos.filter(todo => {
    if (filterValue === FilteredStatus.ACTIVE) {
      return !todo.completed;
    }

    if (filterValue === FilteredStatus.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const onDelete = (todoId: number) => {
    setDeletedTodoId(prevIds => [...prevIds, todoId]);

    const removeTodo = deleteTodos(todoId);

    removeTodo
      .then(() => {
        inputRef.current?.focus();
        const exsistedTodos = todos.filter(todo => todo.id !== todoId);

        setTodos(exsistedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() =>
        setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)),
      );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onInputChange={onInputChange}
          onDelete={onDelete}
          deletedTodoId={deletedTodoId}
        />
      ))}

      {tempTodo && (
        <TempTodo
          title={tempTodo.title}
          completed={tempTodo.completed}
          onInputChange={onInputChange}
        />
      )}
    </section>
  );
};

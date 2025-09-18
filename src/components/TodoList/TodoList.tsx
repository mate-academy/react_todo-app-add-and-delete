import React, { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import * as todoService from '../../api/todos';
import { ErrorMessages } from '../../types/Errors';

interface Props {
  filteredTodos: Todo[];
  todos: Todo[];
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onLoading: React.Dispatch<React.SetStateAction<number[]>>;
  loading: number[];
  tempTodo: Todo | null;
  onErrorMessage: (message: ErrorMessages) => void;
  onDisabledButton: (message: boolean) => void;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  todos,
  onTodos,
  onLoading,
  loading,
  tempTodo,
  onErrorMessage,
  onDisabledButton,
}) => {
  const updatePost = (todoToUpdate: Todo) => {
    onLoading(prev => [...prev, todoToUpdate.id]);

    return todoService
      .updateTodos(todoToUpdate)
      .then(updatedTodo => {
        onTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return {
                ...currentTodo,
                completed: updatedTodo.completed,
                title: updatedTodo.title,
              };
            }

            return currentTodo;
          });
        });
      })
      .catch(() => {
        onErrorMessage(ErrorMessages.Update);
        throw new Error();
      })
      .finally(() =>
        onLoading(prev => prev.filter(item => item !== todoToUpdate.id)),
      );
  };

  const deleteTodos = (todoId: number) => {
    onLoading(prev => [...prev, todoId]);

    return todoService
      .deleteTodos(todoId)
      .then(() => {
        onTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        onErrorMessage(ErrorMessages.Delete);
        throw new Error();
      })
      .finally(() => onLoading(prev => prev.filter(item => item !== todoId)));
  };

  useEffect(() => {
    const isAllCompleted =
      [...todos].filter(todo => todo.completed).length === todos.length;

    if (isAllCompleted) {
      onDisabledButton(true);
    } else {
      onDisabledButton(false);
    }
  }, [todos, onDisabledButton]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdatePost={updatePost}
          onDeleteTodos={deleteTodos}
          loading={loading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onUpdatePost={updatePost}
          onDeleteTodos={deleteTodos}
          loading={loading}
        />
      )}
    </section>
  );
};

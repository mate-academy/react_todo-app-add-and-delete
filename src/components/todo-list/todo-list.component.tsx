import React, { useEffect } from 'react';
import { TodoListTypes } from './todo-list.types';
import { TodoItemComponent } from '../todo-Item/todo-item.component';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { text } from '../../constants/text';

export const TodoListComponent: React.FC<TodoListTypes> = ({
  todos,
  setTodos,
  setCustomError,
  customError,
  loadingId,
  handleLoaderId,
  titleField,
}) => {
  const deleteTodoHandler = (todo: Todo) => {
    setCustomError('');
    handleLoaderId(todo);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prevState =>
          prevState.filter(currentTodo => currentTodo.id !== todo.id),
        );
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }
        }, 0);
        handleLoaderId(todo);
      })
      .catch(err => {
        setCustomError(text.unableToDeleteTodo);
        handleLoaderId(todo);
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }
        }, 0);
        throw new Error(err);
      });
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (customError) {
      timerId = setTimeout(() => setCustomError(''), 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [customError, setCustomError]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo => (
          <TodoItemComponent
            loadingId={loadingId}
            key={todo.id}
            todo={todo}
            deleteTodoHandler={deleteTodoHandler}
          />
        ))}
    </section>
  );
};

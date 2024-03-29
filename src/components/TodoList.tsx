/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  getFilteredTodos: Todo[];
  handleDelete: (id: number) => void;
  error: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  getFilteredTodos,
  handleDelete,
  error,
  todos,
  setTodos,
  tempTodo,
}) => {
  const toggleTodoCompletion = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todoId === todo.id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    todoService
      .updateTodo(updatedTodo)
      .then(response => {
        setTodos(currentTodos => {
          const updatedIndex = currentTodos.findIndex(
            todo => todo.id === response.id,
          );
          const updatedTodos = [...currentTodos];

          updatedTodos[updatedIndex] = response;

          return updatedTodos;
        });
      })
      .catch(() => {
        error('Unable to update a todo');
        setTimeout(() => {
          error('');
        }, 3000);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {getFilteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              toggleTodoCompletion={toggleTodoCompletion}
              onDelete={() => handleDelete(todo.id)}
              onUpdate={handleTodoUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key="0" timeout={300} classNames="temp-item">
            <TodoItem
              isLoading={true}
              todo={tempTodo}
              toggleTodoCompletion={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

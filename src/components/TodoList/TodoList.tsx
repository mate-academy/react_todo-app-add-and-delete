import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  indexUpdatedTodo: number,
  deleteTodo: (todo: Todo, todoIndex: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  indexUpdatedTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo, index) => {
        if (tempTodo && index === indexUpdatedTodo) {
          return (
            <div className="todo" key={todo.id}>
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        }

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            indexOfTodo={index}
          />
        );
      })}
    </section>
  );
};

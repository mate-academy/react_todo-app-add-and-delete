/* eslint-disable */
import React from "react";
import { Todo } from "../types/Todo";
import { TodoItem } from "./ToDo";

type Props = {
  list: Todo[],
}

export const TodoList: React.FC<Props> = ({ list }) => {
  return (
    <section className="todoapp__main">
      {list.map(todo => {
        return (
          <TodoItem todo={todo} key={todo.id}/>
        )
      })}
    </section>
  )
}

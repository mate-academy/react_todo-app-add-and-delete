// react
import { FC, useContext } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoContext } from '../../context/todo/TodoContext';

interface TodoTempItemProps {}

export const TodoTempItem: FC<TodoTempItemProps> = ({}) => {
  const { tempTodoText } = useContext(TodoContext);

  return tempTodoText ? (
    <TodoItem
      id={0}
      completed={false}
      userId={0}
      isTempTodoLoading={true}
      title={tempTodoText}
    />
  ) : null;
};

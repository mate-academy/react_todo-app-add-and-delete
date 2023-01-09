// import classNames from 'classnames';
import React, { useState } from 'react';
import '../styles/transition.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoIds: number[]) => void;
  isRemoving: boolean;
  currentTodoId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  isRemoving,
  currentTodoId,
}) => {
  const [inputSelectedId, setInputSelectedId] = useState('');
  const [inputValue, setInputValue] = useState('');

  const onInputBlur = () => {
    setInputSelectedId('');
  };

  const onDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todoId: number,
  ) => {
    const value = event.currentTarget.textContent;

    setInputValue(value || '');
    setInputSelectedId(`${todoId}`);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isInputSelected={+inputSelectedId === todo.id}
              onTodoDelete={onTodoDelete}
              onInputChange={onInputChange}
              inputValue={inputValue}
              onDoubleClick={onDoubleClick}
              onInputBlur={onInputBlur}
              isActive={
                isRemoving && !!currentTodoId.find(todoId => todoId === todo.id)
              }
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodoItem tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};

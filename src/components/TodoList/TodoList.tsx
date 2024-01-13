import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ActionType, ErrorMessage, Item } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { removeTodo } from '../../api/todos';
import { TodosContext } from '../../store/TodoProvider';

type Props = {
  items: Item[],
  tempItem?: Item | null,
};

export const TodoList: React.FC<Props> = ({ items, tempItem = null }) => {
  const { state, dispatch } = useContext(TodosContext);

  const { processed } = state;

  const removeTodoItem = (id: number) => {
    dispatch({ type: ActionType.PROCESSED, payload: [id] });

    removeTodo(id)
      .then(() => dispatch({
        type: ActionType.REMOVE,
        payload: id,
      }))
      .catch(() => dispatch({
        type: ActionType.ERROR,
        payload: ErrorMessage.UNABLE_DELETE,
      }))
      .finally(() => {
        dispatch({ type: ActionType.PROCESSED, payload: [] });
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {items.map(item => (
          <CSSTransition
            key={item.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              item={item}
              isProcessed={processed.includes(item.id)}
              onRemove={removeTodoItem}
            />
          </CSSTransition>
        ))}

        {!!tempItem && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem item={tempItem} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

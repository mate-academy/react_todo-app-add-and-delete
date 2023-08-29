import { useState } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[]
};

export const TodoToggleAll: React.FC<Props> = ({ todos }) => {
  const [items, setItems] = useState(todos);
  const isNotCompleted = items.some(currentItem => !currentItem.completed);

  const handleInputChange = () => {
    if (isNotCompleted) {
      const newItems = items.map(item => {
        if (!item.completed) {
          const newItem: Todo = {
            ...item,
            completed: true,
          };

          return newItem;
        }

        return item;
      });

      setItems(newItems);
    } else {
      const newItems = items.map(item => {
        const newItem: Todo = {
          ...item,
          completed: false,
        };

        return newItem;
      });

      setItems(newItems);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        id="toggle-all"
        className="todoapp__toggle-all active"
        onClick={handleInputChange}
      />
    </>
  );
};

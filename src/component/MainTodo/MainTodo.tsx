import React from 'react';
import { Todo } from '../../types/Todo';
import { MainList } from './MainList';

interface Props {
  formValue: Todo[];
  deleteToDo: (userId: number) => void;
  tempTodo: Todo | null;
}

export const MainTodo: React.FC<Props> = (
  { formValue, deleteToDo, tempTodo },
) => {
  return (
    <section className="todoapp__main">
      {tempTodo !== null ? (

        <MainList
          formList={tempTodo}
          key={tempTodo.id}
          deleteToDo={deleteToDo}
        />
      )
        : (
          formValue.map((formList) => (
            <MainList
              formList={formList}
              key={formList.id}
              deleteToDo={deleteToDo}
            />
          ))
        )}
    </section>
  );
};

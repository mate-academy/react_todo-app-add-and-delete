import { Types, UpdatedTodoIdActions } from '../../reducer';

export const setUpdatedTodoIdAction = (id: number): UpdatedTodoIdActions => {
  return {
    type: Types.SetUpdatedTodoId,
    payload: {
      updatedTodoId: id,
    },
  };
};

export const removeUpdatedTodoIdAction = (
  updatedTodoId: number,
):UpdatedTodoIdActions => {
  return {
    type: Types.RemoveUpdatedTodoId,
    payload: {
      updatedTodoId,
    },
  };
};

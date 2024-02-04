import { Actions, ErrorMessages } from '../enums';
import { Todo } from './Todo';

export type Action =
  {
    type:Actions.load,
    payload:{todos:Todo[]}
  }
  | {
  type:Actions.addTempTodo,
  payload:{todo:Todo | null}
}
  | {
  type:Actions.add | Actions.update,
  payload:{todo:Todo}
}
  | {
  type:Actions.delete,
  payload:{todoId:number}
}
  | {
  type:Actions.toggleAll,
  payload:{isCompleted:boolean}
}
  | {
  type:Actions.clearCompleted,
}
  | {
  type:Actions.setErrorMessage,
  payload:{errorMessage:ErrorMessages}
}
  | {
  type:Actions.setLoader,
  payload:{isLoading:boolean, todoIds?:number[]}
};

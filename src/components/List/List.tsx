import { FC } from 'react';
import { GrSubtract } from 'react-icons/gr';
import { useTypedDispatch } from '../../hooks/redux';
import ActionButton from '../ActionButton/ActionButton';
import { IList, ITask } from '../../types';
import Task from '../Task/Task';
import { deleteList, setModalAcitive } from '../../store/slices/boardsSlice';
import { addLog } from '../../store/slices/loggerSlice';
import { v4 } from 'uuid';
import { setModalData } from '../../store/slices/modalSlice';
import { deleteButton, header, listWrapper, name } from './List.css';
import { Droppable } from 'react-beautiful-dnd';

type TListProps = {
  boardId: string;
  list: IList;
}

const List: FC<TListProps> = ({ list, boardId }) => {

  const dispatch = useTypedDispatch();

  // task modal 
  const handleTaskChange = (
    boardId : string, 
    listId : string, 
    task : ITask
  ) => {
    dispatch(setModalData({boardId, listId, task}));
    dispatch(setModalAcitive(true));
  }

  const handleListDelete = (listId: string) => {
    // delete list
    dispatch(deleteList({boardId, listId}));
    // add log
    dispatch(
      addLog({
        logId: v4(),
        logMessage: `리스트 삭제하기: ${list.listName}`,
        logAuthor: "user",
        logTimestamp: String(Date.now()),
      })
    );
  }

  return (
    <Droppable droppableId={list.listId}>
      {provied => (
        <div 
          {...provied.droppableProps}
          ref={provied.innerRef}
          className={listWrapper}
        >
          <div className={header}>
            <div className={name}>{list.listName}</div>
            <GrSubtract 
              className={deleteButton}
              onClick={() => handleListDelete(list.listId)}
            />
          </div>
          {list.tasks.map((task, index) => (
            <div
              onClick={() => handleTaskChange(boardId, list.listId, task)}
              key={task.taskId}
            >
              <Task 
                taskName={task.taskName}
                taskDescription={task.taskDescription}
                boardId={boardId}
                id={task.taskId}
                index={index}
              />
            </div>
          ))}
          {provied.placeholder}
          <ActionButton 
            boardId={boardId}
            listId={list.listId}
          />
        </div>
      )}
    </Droppable>
  )
}

export default List

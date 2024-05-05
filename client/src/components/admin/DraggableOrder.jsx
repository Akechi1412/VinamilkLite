import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import PropTypes from 'prop-types';

function DraggableOrder({ dataList, onChange }) {
  const [currentList, setCurrentList] = useState(dataList);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newDataList = Array.from(currentList);
    const [removed] = newDataList.splice(result.source.index, 1);
    newDataList.splice(result.destination.index, 0, removed);
    setCurrentList(newDataList);
    onChange(newDataList);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="orders">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {currentList.map((item, index) => (
              <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="border border-gray-500 px-3 py-2.5 rounded-md text-gray-900 font-[500]"
                  >
                    {item.name}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

DraggableOrder.propTypes = {
  dataList: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DraggableOrder;

import  { useState } from 'react';

const ElementAdder = () => {
  const [elements, setElements] = useState([]);

  const addElement = () => {
    const newElement = {
      id: Date.now(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter(element => element.id !== id));
  };

  const clearElements = () => {
    setElements([]);
  };

  return (
    <div>
      <button onClick={addElement}>Agregar Elemento</button>
      <button onClick={clearElements}>Vaciar Elementos</button>
      <div>
        {elements.map(element => (
          <div
            key={element.id}
            style={{
              backgroundColor: element.color,
              padding: '10px',
              margin: '5px',
              display: 'inline-block',
              cursor: 'pointer'
            }}
            onClick={() => removeElement(element.id)}
          >
            <span>Elemento</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementAdder;
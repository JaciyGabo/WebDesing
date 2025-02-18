import  { useState } from 'react';
import '../App.css'; // Importa los estilos

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
      <button className="clear-button" onClick={clearElements}>Vaciar Elementos</button>
      <div className="element-container">
        {elements.map(element => (
          <div
            key={element.id}
            className="element"
            style={{ backgroundColor: element.color }}
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
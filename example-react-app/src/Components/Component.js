import React from 'react';

const ExampleComponent = (props) => {
    const [isHey, setHey] = React.useState(true);

    return (
        <div>
            <button onClick={()=>{setHey(!isHey)}}>
                Click
            </button>
            <h1>
                {(isHey) ? "Hey" : "Yo"}
            </h1>
        </div>
    );
}

export default ExampleComponent;
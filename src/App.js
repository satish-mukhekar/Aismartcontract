// app.js

import React from 'react';
import Contractcompile from './components/ContractDeploymentComponent';
import ContractDisplayComponent from './components/ContractDisplayComponent';


const App = () => {
    return (
        <div>
            <ContractDisplayComponent />
            <Contractcompile />
        </div>
    );
};

export default App;

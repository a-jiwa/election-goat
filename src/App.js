import React from 'react';
import './styles.css';
import Header from './components/Header';
import Left from './components/Left';
import Title from './components/Title';
import Headline from './components/Headline';
import Chart from './components/Chart';
import Events from './components/Events';
import ElectionPrediction from './components/ElectionPrediction';
import Right from './components/Right';
import Footer from './components/Footer';

function App() {
    return (
        <div className="container">
            <Header />
            <Left />
            <Title />
            <Chart />
            <Events />
            <ElectionPrediction />
            <Right />
            <Footer />
        </div>
    );
}

export default App;

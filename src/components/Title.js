import React from 'react';
import TitleTop from "./TitleTop";
import TitleMain from './TitleMain';
import TitleSub from './TitleSub';

function Title() {
    return (
        <div className="title">
            <TitleTop />
            <TitleMain />
            <TitleSub />
        </div>
    );
}

export default Title;

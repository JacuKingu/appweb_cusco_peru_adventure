import React from "react";
import '../20240912_COD_styles/20240912_COD_spinnerLoader.css';

const SpineLoader = () => {
    return (
        /*  <div class="loader"></div> */
        <div className="container">
            <div className="cloud front">
                <span className="left-front"></span>
                <span className="right-front"></span>
            </div>
            <span className="sun sunshine"></span>
            <span className="sun"></span>
            <div className="cloud back">
                <span className="left-back"></span>
                <span className="right-back"></span>
            </div>
        </div>
    );
};

export default SpineLoader;



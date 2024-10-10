import React from 'react';
import Sidebar from '../20240912_COD_components/20240912_COD_Sidebar';
import Header from '../20240912_COD_components/20240912_COD_Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header /> 
            <div className="flex flex-grow">
                <Sidebar /> 
                <div className="ml-64 p-4 w-full"> 
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default MainLayout;

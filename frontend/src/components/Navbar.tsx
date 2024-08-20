import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-500 p-4">
            <div className="container mx-auto flex justify-between">
                <Link to="/create-database" className="text-white px-3 py-2 rounded-md text-sm font-medium">Create Database</Link>
                <Link to="/database-list" className="text-white px-3 py-2 rounded-md text-sm font-medium">Database List</Link>
                <Link to="/deploy-backend" className="text-white px-3 py-2 rounded-md text-sm font-medium">Deploy Backend</Link>
                <Link to="/deploy-backend-list" className="text-white px-3 py-2 rounded-md text-sm font-medium">Deploy Backend List</Link>
            </div>
        </nav>
    );
};

export default Navbar;

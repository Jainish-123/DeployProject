import React, { useEffect, useState, useRef } from 'react';
import { fetchUserDatabases, retriveDbCredentials } from '../apis/databaseService';
import { DatabaseConfiguration } from '../interfaces/DatabaseConfiguration';
import { useNavigate } from 'react-router-dom';
import AxiosError from '../interfaces/AxiosError';
import { toast } from 'react-toastify';

const FetchUserDatabases = () => {
    const [databases, setDatabases] = useState<DatabaseConfiguration[]>([]);
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [currentDbId, setCurrentDbId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        if (storedUserId && storedEmail) {
            setEmail(storedEmail);
            fetchDatabases(storedUserId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowForm(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalRef]); // Adding click outside functionality

    const fetchDatabases = async (userId: string) => {
        try {
            setIsLoading(true);
            const response = await fetchUserDatabases(userId);
            if (response && response.data) {
                setDatabases(response.data.configurations);
                setError('');
            }
        } catch (error) {
            console.error("Databases fetch failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Failed to fetch databases. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotCredentials = async (dbId: string) => {
        setShowForm(true);
        setCurrentDbId(dbId);
    };

    const handleSubmitPassword = async () => {
        setShowForm(false);
        setIsLoading(true);
        await retriveCredentials(password, currentDbId);
        setPassword('');
    };

    const retriveCredentials = async (password: string, dbId: string) => {
        try {
            const response = await retriveDbCredentials(dbId, email, password);
            if (response && response.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Retrieve Database Credentials failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Retrieve Database Credentials failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className={`container mx-auto px-4 ${showForm ? 'filter blur-sm' : ''}`}>
                <h1 className="text-2xl font-bold text-center my-4">User Databases</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    DB Identifier
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    DB Name
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Endpoint
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Port
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {databases.map((db) => (
                                <tr key={db.Id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="py-4 px-6">
                                        {db.dbInstanceIdentifier}
                                    </td>
                                    <td className="py-4 px-6">
                                        {db.dbName}
                                    </td>
                                    <td className="py-4 px-6">
                                        {db.dbEndpoint}
                                    </td>
                                    <td className="py-4 px-6">
                                        {db.port}
                                    </td>
                                    <td className="py-4 px-6">
                                        <button onClick={() => handleForgotCredentials(db.Id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            Forgot Credentials
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setShowForm(false)}>
                    <div className="mt-4 p-4 max-w-sm mx-auto bg-white rounded-lg border shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter account password"
                            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                        <button onClick={handleSubmitPassword} className="mt-4 w-full text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Submit
                        </button>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
                    <div className="text-lg font-semibold">Loading...</div>
                </div>
            )}
        </div>
    );
};

export default FetchUserDatabases;

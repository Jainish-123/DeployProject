import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { checkDbInstanceExists, createDatabaseStack, storeDatabaseInfo } from '../apis/databaseService';
import { useNavigate } from 'react-router-dom';
import AxiosError from '../interfaces/AxiosError';

const CreateDatabase: React.FC = () => {
    const [dbInstanceIdentifier, setDbInstanceIdentifier] = useState<string>('');
    const [dbName, setDbName] = useState<string>('');
    const [dbUser, setDbUser] = useState<string>('');
    const [dbPassword, setDbPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const [userId, setUserId] = useState<string>('');
    const identifierPattern = /^[a-zA-Z][a-zA-Z0-9]*$/;
    const userPattern = /^[a-zA-Z][a-zA-Z0-9]*$/;
    const passwordPattern = /^[a-zA-Z0-9]{8,}$/;

    const validateInput = (value: string, pattern: any) => pattern.test(value);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        if (storedUserId && storedEmail) {
            setUserId(storedUserId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (
            !identifierPattern.test(dbInstanceIdentifier) ||
            !identifierPattern.test(dbName) ||
            !userPattern.test(dbUser) ||
            !passwordPattern.test(dbPassword)
        ) {
            toast.error('Please enter valid inputs.');
            return;
        }
        setLoading(true);

        try {
            const checkResponse = await checkDbInstanceExists(dbInstanceIdentifier);
            if (checkResponse && checkResponse.data.exists) {
                toast.error("Database server name already exixts");
            }
            else {
                const response = await createDatabaseStack(dbInstanceIdentifier, dbName, dbUser, dbPassword);
                if (response && response.data) {
                    console.log('Database created successfully:', response);
                    if (userId) {
                        const result = await storeDatabaseInfo(userId, dbInstanceIdentifier, dbName, dbUser, dbPassword, response.data.dbEndpoint, response.data.port)
                        if (result && result.data) {
                            console.log('Database info stored successfully:', result);
                            toast.success('Database created successfully!');
                            navigate("/database-list");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Database creation failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Database creation failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-gray-100 p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Database Configuration</h2>
            <div className="mb-4">
                <label htmlFor="dbInstanceIdentifier" className="block text-gray-600 text-sm font-medium mb-2">
                    Database Server Name
                </label>
                <input
                    type="text"
                    id="dbInstanceIdentifier"
                    value={dbInstanceIdentifier}
                    onChange={(e) => setDbInstanceIdentifier(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-1"
                    required
                />
                {!validateInput(dbInstanceIdentifier, identifierPattern) && dbInstanceIdentifier &&
                    <p className="text-red-500 text-xs italic">Must begin with a letter and contain only alphanumeric characters.</p>
                }
            </div>

            <div className="mb-4">
                <label htmlFor="dbName" className="block text-gray-600 text-sm font-medium mb-2">
                    Database Name
                </label>
                <input
                    type="text"
                    id="dbName"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-1"
                    required
                />
                {!validateInput(dbName, identifierPattern) && dbName &&
                    <p className="text-red-500 text-xs italic">Must begin with a letter and contain only alphanumeric characters.</p>
                }
            </div>

            <div className="mb-4">
                <label htmlFor="dbUser" className="block text-gray-600 text-sm font-medium mb-2">
                    Database Username
                </label>
                <input
                    type="text"
                    id="dbUser"
                    value={dbUser}
                    onChange={(e) => setDbUser(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-1"
                    required
                />
                {!validateInput(dbUser, userPattern) && dbUser &&
                    <p className="text-red-500 text-xs italic">Must begin with a letter and contain only alphanumeric characters.</p>
                }
            </div>

            <div className="mb-6">
                <label htmlFor="dbPassword" className="block text-gray-600 text-sm font-medium mb-2">
                    Database Password
                </label>
                <input
                    type="password"
                    id="dbPassword"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-1"
                    required
                />
                {!validateInput(dbPassword, passwordPattern) && dbPassword &&
                    <p className="text-red-500 text-xs italic">Must contain only alphanumeric characters and have a minimum length of 8.</p>
                }
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full mb-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Creating...' : 'Create Database'}
            </button>
        </form>

    );
};

export default CreateDatabase;

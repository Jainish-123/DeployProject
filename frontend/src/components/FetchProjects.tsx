import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosError from '../interfaces/AxiosError';
import { Projects } from '../interfaces/Projects';
import { fetchUserProjects } from '../apis/deployService';

const FetchUserProjects = () => {
    const [projects, setProjects] = useState<Projects[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        if (storedUserId && storedEmail) {
            fetchProjects(storedUserId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchProjects = async (userId: string) => {
        try {
            setIsLoading(true);
            const response = await fetchUserProjects(userId);
            if (response && response.data) {
                setProjects(response.data.projects);
                setError('');
            }
        } catch (error) {
            console.error("Projects fetch failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Failed to fetch projects. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <h1 className="text-2xl font-bold text-center my-4">User Databases</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Project
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Url
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((pr) => (
                            <tr key={pr.Id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="py-4 px-6">
                                    {pr.project}
                                </td>
                                <td className="py-4 px-6">
                                    {pr.url}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLoading && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
                    <div className="text-lg font-semibold">Loading...</div>
                </div>
            )}
        </div>
    );
};

export default FetchUserProjects;

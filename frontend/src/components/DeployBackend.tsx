import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AxiosError from '../interfaces/AxiosError';
import { deployBackend, storeDeployedBackendInfo } from '../apis/deployService';

const DeployBackend: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [baseDir, setBaseDir] = useState('');
    const [environment, setEnvironment] = useState('node');
    const [runCommand, setRunCommand] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const navigate = useNavigate();

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
        setLoading(true);
        try {
            const response = await deployBackend(repoUrl, baseDir, environment, runCommand);
            if (response && response.data) {
                console.log('Backend deployed successfully:', response);
                if (userId) {
                    const result = await storeDeployedBackendInfo(userId, response.data.project, response.data.url);
                    console.log('Deployed project info stored successfully:', result);
                    toast.success('Backend deployed successfully!');
                    navigate("/deploy-backend-list");
                }
            }
        } catch (error) {
            console.error("Deployment failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Deployment failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-gray-100 p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Deploy Backend</h2>

            <div className="mb-4">
                <label htmlFor="repoUrl" className="block text-gray-600 text-sm font-medium mb-2">
                    Repository URL
                </label>
                <input
                    type="text"
                    id="repoUrl"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="baseDir" className="block text-gray-600 text-sm font-medium mb-2">
                    Base Directory
                </label>
                <input
                    type="text"
                    id="baseDir"
                    value={baseDir}
                    onChange={(e) => setBaseDir(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="environment" className="block text-gray-600 text-sm font-medium mb-2">
                    Environment
                </label>
                <select
                    id="environment"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="form-select mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="node">Node</option>
                    <option value="python">Python</option>
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="runCommand" className="block text-gray-600 text-sm font-medium mb-2">
                    Run Command
                </label>
                <input
                    type="text"
                    id="runCommand"
                    value={runCommand}
                    onChange={(e) => setRunCommand(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full mb-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Deploying...' : 'Deploy Backend'}
            </button>
        </form>
    );
};

export default DeployBackend;

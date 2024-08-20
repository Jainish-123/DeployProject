import { Route, Routes } from "react-router-dom"
import { SignupPage } from "../components/SignupPage"
import { LoginPage } from "../components/LoginPage"
import CreateDatabase from "../components/CraeteDatabase"
import Layout from "../components/Layout"
import FetchUserDatabases from "../components/FetchDatabases"
import DeployBackend from "../components/DeployBackend"
import FetchUserProjects from "../components/FetchProjects"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" Component={SignupPage} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/create-database" element={<Layout><CreateDatabase /></Layout>} />
            <Route path="/database-list" element={<Layout><FetchUserDatabases /></Layout>} />
            <Route path="/deploy-backend" element={<Layout><DeployBackend /></Layout>} />
            <Route path="/deploy-backend-list" element={<Layout><FetchUserProjects /></Layout>} />
        </Routes>
    )
}

export default AppRoutes

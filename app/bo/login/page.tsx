import { Suspense } from "react";
import LoginPageContent from "./content";


const LoginPage = () => <Suspense fallback={<div>Loading...</div>}>
    <LoginPageContent />
</Suspense>

export default LoginPage;

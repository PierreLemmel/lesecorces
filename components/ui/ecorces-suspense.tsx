import { Suspense } from "react";
import LoadingSpinner from "./loading-spinner";

type EcorcesSuspenseProps = {
    children: React.ReactNode;
}

const EcorcesSuspense = ({ children }: EcorcesSuspenseProps) => <Suspense fallback={<LoadingSpinner />}>
    {children}
</Suspense>

export default EcorcesSuspense;
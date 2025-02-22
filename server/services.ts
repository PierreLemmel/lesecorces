import { pathCombine } from "../lib/files";
import { getDocument, setDocument } from "../lib/firebase";

export type EcorcesService = {
    name: string;
    content: string;
    visible: boolean;
}

type ServicesDataModel = {
    services: EcorcesService[];
}

const pathToServices = (collection: string) => pathCombine("services", collection);

type GetServicesParams = {
    visible: boolean;
}

export async function getServices(collection: string, options: Partial<GetServicesParams> = {}): Promise<EcorcesService[]> {

    const {
        visible
    } = options;

    const path = pathToServices(collection);

    let { services } = await getDocument<ServicesDataModel>(path);

    if (visible === true) {
        services = services.filter(service => service.visible);
    }

    return services;
}

export async function saveServices(services: EcorcesService[], collection: string): Promise<EcorcesService[]> {
    const path = pathToServices(collection);

    await setDocument<ServicesDataModel>(path, { services }, true);

    return services;
}

export function duplicateService(service: EcorcesService) {
    const newName = service.name + " (copie)";
    
    const result = structuredClone(service);
    result.name = newName;

    return result;
}
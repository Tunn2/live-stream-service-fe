import { useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "../../configs/axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import create from "@ant-design/icons/lib/components/IconFont";

export const useViewerToken = (streamId, userId, hostId) => {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const createToken = async () => {
            try {
                const viewerToken = await api.get(`/viewer-token?streamId=${streamId}&userId=${userId}&hostId=${hostId}`);

                setToken(viewerToken);

                const decodedToken = jwtDecode(viewerToken) as JwtPayload & {name?: string};
                const name = decodedToken?.name;
                const identity = decodedToken.jti;

                if (identity) {
                    setIdentity(identity);
                }
                if (name) {
                    setIdentity(name);
                }
            } catch (error) {
                toast.error("Something went wrong")
            }
        }

        createToken();
    }, [streamId, userId, hostId])

    return (
        token, name, identity
    );
};
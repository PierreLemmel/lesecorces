'use client';

import { useEffect } from "react";

export type RedirectToProps = {
    url: string;
};


const RedirectTo = (props: RedirectToProps) => {

    const { url } = props;

    useEffect(() => {
        window.location.href = url;
    }, []);

    return null;
};

export default RedirectTo;
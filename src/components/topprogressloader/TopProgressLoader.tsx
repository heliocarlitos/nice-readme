'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import './TopProgressLoader.css';

type Props = {
    height?: string;
};

export default function TopProgressLoader({ height = '3px' }: Props) {
    const pathname = usePathname();
    const [isPending] = useTransition();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isPending) return;

        setVisible(true);
        setProgress(10);

        const interval = window.setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 3 : prev));
        }, 120);

        return () => clearInterval(interval);
    }, [isPending]);

    useEffect(() => {
        if (!isPending && visible) {
            setProgress(100);
            const timeout = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isPending, visible]);

    useEffect(() => {
        setVisible(true);
        setProgress(15);
    }, [pathname]);

    if (!visible) return null;

    return (
        <div
            className="top-loader-bar"
            style={{
                width: `${progress}%`,
                height,
            }}
        />
    );
}

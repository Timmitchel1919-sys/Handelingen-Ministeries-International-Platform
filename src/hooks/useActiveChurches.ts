import { useCallback, useEffect, useState } from 'react';

import { getActiveChurches } from '@/services/church-service';
import type { Church } from '@/types/church';

type ChurchesStatus = 'loading' | 'success' | 'error';

interface UseActiveChurchesResult {
    churches: Church[];
    status: ChurchesStatus;
    error: Error | null;
    reload: () => void;
}

export function useActiveChurches(): UseActiveChurchesResult {
    const [churches, setChurches] = useState<Church[]>([]);
    const [status, setStatus] = useState<ChurchesStatus>('loading');
    const [error, setError] = useState<Error | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => {
        setReloadToken((current) => current + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;

        setStatus('loading');
        setError(null);

        getActiveChurches()
            .then((result) => {
                if (cancelled) {
                    return;
                }

                setChurches(result);
                setStatus('success');
            })
            .catch((cause: unknown) => {
                if (cancelled) {
                    return;
                }

                const normalizedError =
                    cause instanceof Error
                        ? cause
                        : new Error('Unable to load active churches.');

                setChurches([]);
                setError(normalizedError);
                setStatus('error');
            });

        return () => {
            cancelled = true;
        };
    }, [reloadToken]);

    return {
        churches,
        status,
        error,
        reload,
    };
}
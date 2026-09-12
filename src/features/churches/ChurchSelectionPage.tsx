import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { getActiveChurches } from '@/services/church-service';
import { storeSelectedChurch } from '@/services/church-context';
import type { Church } from '@/types/church';

export default function ChurchSelectionPage() {
  const navigate = useNavigate();

  const [churches, setChurches] = useState<Church[]>([]);
  const [search, setSearch] = useState('');
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChurches() {
      try {
        setLoading(true);
        setError(null);

        const result = await getActiveChurches();

        if (!cancelled) {
          setChurches(result);
        }
      } catch {
        if (!cancelled) {
          setError(
            'Unable to load churches. Please try again.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadChurches();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredChurches = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return churches;
    }

    return churches.filter((church) =>
      [
        church.name,
        church.shortName,
        church.country,
        church.district,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedSearch),
        ),
    );
  }, [churches, search]);

  function selectChurch(church: Church) {
    setSelectedChurchId(church.id);
    storeSelectedChurch(church);
  }

  function continueRegistration() {
    if (!selectedChurchId) {
      return;
    }

    navigate(`/register?churchId=${encodeURIComponent(selectedChurchId)}`);
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            ← Back
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Select your church
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Select the church you belong to before continuing with
            your registration.
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="church-search"
            className="sr-only"
          >
            Search churches
          </label>

          <input
            id="church-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search churches..."
            className="w-full rounded-2xl border border-border bg-background/70 px-5 py-3.5 outline-none transition focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {loading && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            Loading churches...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredChurches.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-medium">
              No churches found.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try another search.
            </p>
          </div>
        )}

        {!loading && !error && filteredChurches.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredChurches.map((church) => {
              const selected = church.id === selectedChurchId;

              return (
                <button
                  key={church.id}
                  type="button"
                  onClick={() => selectChurch(church)}
                  aria-pressed={selected}
                  className={[
                    'rounded-3xl border p-6 text-left transition-all',
                    'bg-card/80 backdrop-blur-xl',
                    'hover:-translate-y-0.5 hover:shadow-lg',
                    selected
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {church.name}
                      </h2>

                      {church.shortName && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {church.shortName}
                        </p>
                      )}
                    </div>

                    {selected && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="mt-5 space-y-1 text-sm text-muted-foreground">
                    <p>{church.country}</p>
                    <p>{church.district}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={continueRegistration}
            disabled={!selectedChurchId}
            className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue registration
          </button>
        </div>
      </div>
    </main>
  );
}
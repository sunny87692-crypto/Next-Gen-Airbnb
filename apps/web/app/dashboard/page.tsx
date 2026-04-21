'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { fetchProfile } from '../../lib/auth';

type Profile = {
  id: string;
  email: string;
  name: string;
  message: string;
};

export default function DashboardPage() {
  const { isAuthenticated, isReady, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !isAuthenticated) {
      return;
    }

    fetchProfile()
      .then((result) => {
        setProfile(result);
      })
      .catch((error) => {
        setProfileError((error as Error).message);
      });
  }, [isReady, isAuthenticated]);

  if (!isReady) {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-indigo-500/10">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="mt-4 text-slate-300">Checking authentication status…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-indigo-500/10">
        <h1 className="text-4xl font-bold text-white">Protected Dashboard</h1>
        <p className="mt-4 text-slate-300">You must be signed in to view dashboard metrics.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/login" className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Sign in
          </Link>
          <Link href="/register" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Register
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-indigo-500/10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="mt-4 text-slate-300">
            This dashboard is now protected and visible only to authenticated users.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="self-start rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Log out
        </button>
      </div>
      <div className="mt-6 space-y-6">
        {profileError ? (
          <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 text-orange-100">
            <p className="font-semibold">Unable to load profile</p>
            <p className="mt-2 text-sm text-orange-100">{profileError}</p>
          </div>
        ) : null}

        {profile ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Signed in as</h2>
            <p className="mt-3 text-slate-300">{profile.name} • {profile.email}</p>
            <p className="mt-2 text-sm text-slate-400">{profile.message}</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Profile</h2>
            <p className="mt-3 text-slate-300">Loading profile data from the auth service...</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Current Sprint</h2>
            <p className="mt-3 text-slate-300">Sprint 1: Project Setup & Web Frontend</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Next Target</h2>
            <p className="mt-3 text-slate-300">Integrate backend service authentication and user session state.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

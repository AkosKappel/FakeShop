import { useRef, useState } from 'react';
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router';
import {
  LuEye,
  LuEyeOff,
  LuHeart,
  LuLogOut,
  LuPackage,
  LuScale,
  LuUser,
} from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import {
  AuthError,
  DEMO_ACCOUNT,
  refreshSession,
  sessionStore,
  signIn,
  signOut,
  useSession,
} from '../lib/auth';

export async function loader() {
  const hadSession = sessionStore.get() !== null;
  const session = await refreshSession();
  return { expired: hadSession && session === null };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!username || !password) {
    return { error: 'Enter your username and password' };
  }
  try {
    await signIn(username, password);
  } catch (error) {
    if (error instanceof AuthError) return { error: error.message };
    return { error: 'Could not reach the sign-in service, please try again' };
  }
  // Only same-site paths, so the redirect cannot be abused to leave the shop.
  const next = new URL(request.url).searchParams.get('next');
  return redirect(
    next?.startsWith('/') && !next.startsWith('//') ? next : '/account'
  );
}

function SignInForm({ expired }: { expired: boolean }) {
  const result = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const submitting = navigation.state === 'submitting';

  const useDemoAccount = () => {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem('username') as HTMLInputElement).value =
      DEMO_ACCOUNT.username;
    (form.elements.namedItem('password') as HTMLInputElement).value =
      DEMO_ACCOUNT.password;
    form.requestSubmit();
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Sign in</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Optional: an account fills in your address at checkout. Accounts come
          from DummyJSON's demo users, so there is nothing to register.
        </p>
      </div>
      <div className="card space-y-5 p-6">
        {expired && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Your session has expired. Please sign in again.
          </p>
        )}
        <Form method="post" ref={formRef} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              className="field"
              aria-invalid={result?.error ? true : undefined}
              aria-describedby={result?.error ? 'sign-in-error' : undefined}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            {/* The toggle sits next to the input, not inside it, so password
                manager icons at the input's right edge stay uncovered. */}
            <div className="flex">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoCapitalize="none"
                spellCheck={false}
                className="field rounded-r-none"
                aria-invalid={result?.error ? true : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
                aria-controls="password"
                aria-label="Show password"
                title={showPassword ? 'Hide password' : 'Show password'}
                className="flex w-12 shrink-0 cursor-pointer items-center justify-center rounded-r-xl bg-zinc-50 text-zinc-600 ring-1 ring-zinc-300 ring-inset hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
              >
                {showPassword ? (
                  <LuEyeOff className="size-5" />
                ) : (
                  <LuEye className="size-5" />
                )}
              </button>
            </div>
          </div>
          {result?.error && (
            <p
              id="sign-in-error"
              role="alert"
              className="text-sm text-red-600 dark:text-red-400"
            >
              {result.error}
            </p>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </Form>
        <p className="flex items-center gap-3 text-xs text-zinc-500 before:h-px before:flex-1 before:bg-zinc-200 after:h-px after:flex-1 after:bg-zinc-200 dark:before:bg-zinc-800 dark:after:bg-zinc-800">
          or
        </p>
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={useDemoAccount}
          disabled={submitting}
        >
          <LuUser className="size-4" aria-hidden="true" />
          Use the demo account
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { expired } = useLoaderData<{ expired: boolean }>();
  const session = useSession();

  if (!session) {
    return (
      <>
        <title>Sign in | FakeShop</title>
        <SignInForm expired={expired} />
      </>
    );
  }

  const { user } = session;
  const links = [
    { to: '/orders', label: 'Your orders', icon: LuPackage },
    { to: '/wishlist', label: 'Wishlist', icon: LuHeart },
    { to: '/compare', label: 'Compare', icon: LuScale },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <title>Your account | FakeShop</title>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
      <div className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
        <img
          src={user.image}
          alt=""
          width={80}
          height={80}
          className="size-20 rounded-full bg-zinc-100 dark:bg-zinc-800"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Hi, {user.firstName}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {user.firstName} {user.lastName} · {user.email}
          </p>
          <p className="text-sm text-zinc-500">Signed in as {user.username}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={signOut}>
          <LuLogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="card p-6" aria-labelledby="address-heading">
          <h2 id="address-heading" className="mb-2 font-bold">
            Delivery address
          </h2>
          <address className="text-zinc-700 not-italic dark:text-zinc-300">
            {user.address.address}
            <br />
            {user.address.postalCode} {user.address.city}
            <br />
            {user.address.country}
          </address>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Filled in for you at checkout.
          </p>
        </section>
        <nav className="card p-3" aria-label="Account">
          <ul>
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Icon
                    className="size-5 text-brand-600 dark:text-brand-400"
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

import {
  Link,
  isRouteErrorResponse,
  useRevalidator,
  useRouteError,
} from 'react-router';
import { LuRotateCcw, LuTriangleAlert } from 'react-icons/lu';

import EmptyState from '../components/EmptyState';
import { isNotFound } from '../lib/api';
import NotFoundPage from './NotFoundPage';

export default function ErrorPage() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  if (
    isNotFound(error) ||
    (isRouteErrorResponse(error) && error.status === 404)
  ) {
    return <NotFoundPage what="product" />;
  }

  console.error(error);

  return (
    <>
      <title>Something went wrong | FakeShop</title>
      <h1 className="sr-only">Something went wrong</h1>
      <EmptyState
        icon={LuTriangleAlert}
        title="We could not load this page"
        actions={
          <>
            <button
              type="button"
              className="btn-primary"
              onClick={() => revalidator.revalidate()}
              disabled={revalidator.state === 'loading'}
            >
              <LuRotateCcw className="size-4" aria-hidden="true" />
              Try again
            </button>
            <Link to="/" className="btn-secondary">
              Go to the home page
            </Link>
          </>
        }
      >
        <p>
          The product data comes from a free public API, which did not answer.
          Check your connection and try again.
        </p>
      </EmptyState>
    </>
  );
}

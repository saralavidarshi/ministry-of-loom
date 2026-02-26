export default function ForbiddenPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2 data-testid="forbidden-title">Forbidden</h2>
      <p data-testid="forbidden-message">You don&apos;t have access to this page.</p>
    </div>
  );
}
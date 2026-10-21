"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="loading">
      <h1>Не удалось открыть страницу</h1>
      <p>Попробуйте загрузить её ещё раз.</p>
      <button onClick={reset}>Повторить</button>
    </main>
  );
}

export async function POST() {
  return Response.json(
    {
      error:
        "Приём обращений пока не подключён. Персональные данные не сохранены.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { mutateDb } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  const removed = await mutateDb((db) => {
    const index = db.history.findIndex((h) => h.id === id && h.userId === user.id);
    if (index === -1) return false;
    db.history.splice(index, 1);
    return true;
  });

  if (!removed) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

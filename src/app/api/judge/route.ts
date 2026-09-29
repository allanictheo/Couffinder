import { judge } from "@/lib/judge";
import { clientIp, NO_STORE } from "@/lib/request";
import { getStore } from "@/lib/store";
import type { JudgeResponse } from "@/lib/types";

export async function GET(request: Request) {
  if (!(await getStore().allow("judge", clientIp(request), 60, 60))) {
    const body: JudgeResponse = {
      status: "invalid",
      message: "Doucement, jeune écuyer ! Trop de mots d'un coup. Reprends ton souffle et réessaie dans un instant.",
    };
    return Response.json(body, { status: 429, headers: NO_STORE });
  }

  const query = new URL(request.url).searchParams.get("q");
  const body: JudgeResponse = await judge(query);
  return Response.json(body, { headers: NO_STORE });
}

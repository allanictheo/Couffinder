import { NO_STORE } from "@/lib/request";
import { getStore } from "@/lib/store";
import type { StatsResponse } from "@/lib/types";
import { CHOUFFIN_COUNT, WORD_COUNT } from "@/lib/words";

export async function GET() {
  const store = getStore();
  const { votes, adopted } = await store.stats();
  const body: StatsResponse = {
    words: WORD_COUNT + adopted,
    chouffinWords: CHOUFFIN_COUNT,
    votes,
    persistent: store.persistent,
  };
  return Response.json(body, { headers: NO_STORE });
}

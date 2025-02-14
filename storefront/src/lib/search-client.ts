import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { SearchClient } from "instantsearch.js";

const endpoint = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "https://ms-d9c51c8dd4c7-18859.lon.meilisearch.io";

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "7c26f26e2051023bab033eb8c3bec8c56ac5e14e";

const ms = instantMeiliSearch("https://ms-d9c51c8dd4c7-18859.lon.meilisearch.io", "7c26f26e2051023bab033eb8c3bec8c56ac5e14e")
export const searchClient = (ms.searchClient as unknown) as SearchClient

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME 
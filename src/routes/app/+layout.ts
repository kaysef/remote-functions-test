import { financeFilters } from '$lib/stores/stores.svelte.js';


export async function load() {
  return {
    filters: new financeFilters()
  }
}
// benchmark_payout_rejection.js

/**
 * Simulates the performance difference between sequential updates (N+1)
 * and a bulk update operation.
 */

const LATENCY_MS = 50; // Simulated network latency per request

const mockUpdate = async (id, updates) => {
  return new Promise(resolve => setTimeout(resolve, LATENCY_MS));
};

const mockBulkUpdate = async (ids, updates) => {
  // A bulk update is still one request, maybe slightly heavier but much faster than N requests
  return new Promise(resolve => setTimeout(resolve, LATENCY_MS * 1.5));
};

async function runBaseline(commissionIds) {
  console.log(`\n--- Running Baseline (Sequential Updates) ---`);
  const start = Date.now();
  for (const id of commissionIds) {
    await mockUpdate(id, { payout_status: 'pending' });
  }
  const end = Date.now();
  const duration = end - start;
  console.log(`Processed ${commissionIds.length} items in ${duration}ms`);
  return duration;
}

async function runOptimized(commissionIds) {
  console.log(`\n--- Running Optimized (Bulk Update) ---`);
  const start = Date.now();
  await mockBulkUpdate(commissionIds, { payout_status: 'pending' });
  const end = Date.now();
  const duration = end - start;
  console.log(`Processed ${commissionIds.length} items in ${duration}ms`);
  return duration;
}

async function main() {
  const SIZES = [10, 50, 100];

  for (const size of SIZES) {
    console.log(`\n=========================================`);
    console.log(`BENCHMARK SIZE: ${size} items`);
    console.log(`=========================================`);

    const commissionIds = Array.from({ length: size }, (_, i) => `id-${i}`);

    const baselineTime = await runBaseline(commissionIds);
    const optimizedTime = await runOptimized(commissionIds);

    const improvement = ((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2);
    console.log(`\nResults for ${size} items:`);
    console.log(`Baseline: ${baselineTime}ms`);
    console.log(`Optimized: ${optimizedTime}ms`);
    console.log(`Improvement: ${improvement}% faster`);
  }
}

main().catch(console.error);

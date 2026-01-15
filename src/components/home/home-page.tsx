import PoolsTable from "@/components/pools";
import { PageContainer } from "@/components/layout/page-container";

export const HomePage = () => {
  return (
    <PageContainer>
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-neutral-50">Seturan Pools</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Browse lending pools and click a row to view detailed pool
            information.
          </p>
        </header>

        <PoolsTable />
      </section>
    </PageContainer>
  );
};

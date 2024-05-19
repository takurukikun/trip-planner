import Loading from "@/components/loading";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Vacations",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap 2xl:flex-nowrap justify-center">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  action?: {
    label: string;
    href: string;
  };
};

export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumb?.length ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            {breadcrumb.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-200">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 ? (
                  <ChevronRight className="size-4" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-slate-400">{description}</p>
      </div>
      {action ? (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      ) : null}
    </div>
  );
}

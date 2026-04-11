"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isLoginPage && <AdminSidebar />}
      <div className={cn("transition-all duration-300", !isLoginPage ? "pl-64" : "pl-0")}>
        <div className={cn("p-4 md:p-8", isLoginPage ? "p-0" : "")}>
          {children}
        </div>
      </div>
    </div>
  );
}

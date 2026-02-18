"use client"

import useSWR from "swr"
import { BookOpen, Users, ArrowLeftRight, DollarSign, BookCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecentTransactions } from "./recent-transactions"
import { BooksTable } from "./books-table"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-card rounded-[--radius-lg] p-6 fairytale-shadow border border-border/30 flex items-start gap-4 hover:fairytale-shadow-lg transition-shadow">
      <div className={cn("w-12 h-12 rounded-[--radius-md] flex items-center justify-center shrink-0", bgColor)}>
        <div className={color}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1 font-serif">{value}</p>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { data: stats } = useSWR("/api/stats", fetcher, { refreshInterval: 3000 })

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Welcome back to the Enchanted Library. Here is your overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Books"
          value={stats?.totalBooks ?? "--"}
          icon={<BookOpen className="w-5 h-5" />}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents ?? "--"}
          icon={<Users className="w-5 h-5" />}
          color="text-accent-foreground"
          bgColor="bg-accent/30"
        />
        <StatCard
          title="Active Issues"
          value={stats?.activeIssues ?? "--"}
          icon={<ArrowLeftRight className="w-5 h-5" />}
          color="text-warning-foreground"
          bgColor="bg-warning/30"
        />
        <StatCard
          title="Available Books"
          value={stats?.availableBooks ?? "--"}
          icon={<BookCheck className="w-5 h-5" />}
          color="text-success-foreground"
          bgColor="bg-success/30"
        />
      </div>

      {/* Fine summary */}
      <div className="bg-card rounded-[--radius-lg] p-6 fairytale-shadow border border-border/30">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-[--radius-md] bg-peach/40 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-warning-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Fines Collected</p>
            <p className="text-xl font-bold text-foreground font-serif">
              {stats?.totalFines != null ? `$${stats.totalFines}` : "--"}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Fines are calculated at $5 per day for books kept beyond the 7-day loan period.
        </p>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BooksTable />
        <RecentTransactions />
      </div>
    </div>
  )
}

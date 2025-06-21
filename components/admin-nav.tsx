"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, Users, BarChart3, MessageSquare, LogOut, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

interface AdminNavProps {
  onLogout: () => void
}

export function AdminNav({ onLogout }: AdminNavProps) {
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Admin</span>
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/admin" className="flex items-center space-x-2 w-full">
            <BarChart3 className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2 w-full">
            <Users className="w-4 h-4" />
            <span>User Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/chat" className="flex items-center space-x-2 w-full">
            <MessageSquare className="w-4 h-4" />
            <span>{t("chat")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="flex items-center space-x-2 text-red-600">
          <LogOut className="w-4 h-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

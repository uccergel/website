'use client'

import * as React from 'react'

import { NavMain } from '#/components/nav-main.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar.tsx'
import {
  HomeIcon,
  SparklesIcon,
  BookmarkIcon,
  BookTextIcon,
  FolderKanbanIcon,
} from 'lucide-react'

const data = {
  navMain: [
    {
      title: 'Hakkımda',
      url: '/',
      icon: <HomeIcon />,
    },
    {
      title: 'Yazılarım',
      url: '/blogs',
      icon: <SparklesIcon />,
    },
    {
      title: 'Yer İmleri',
      url: '/bookmarks',
      icon: <BookmarkIcon />,
    },
    {
      title: 'Kitaplar',
      url: '/books',
      icon: <BookTextIcon />,
    },
    {
      title: 'Projeler',
      url: '/projects',
      icon: <FolderKanbanIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div>Uğur Cem Çergel</div>
        <p>Chemist & Engineer</p>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

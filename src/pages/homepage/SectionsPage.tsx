import { Tabs, Box } from "@mantine/core";
import { CarouselSection } from "./sections/CarouselSection";
import { AnnouncementSection } from "./sections/AnnouncementSection";
// import { QuickLinksSection } from "./sections/QuickLinksSection";
import { AccreditationsSection } from "./sections/AccreditationsSection";
import { StatsSection } from "./sections/StatsSection";
import { SuccessStoriesSection } from "./sections/SuccessStoriesSection";
import { OtherLinksSection } from "./sections/OtherLinksSection";
import { UpdatesSection } from "./sections/UpdatesSection";
import { useState } from 'react';
export interface CarouselItem {
  image: string;
  title?: string;
  subtitle?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  link?: string;
  date: string;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface AccreditationItem {
  id: string;
  name: string;
  logo: string;
  description?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface SuccessStoryItem {
  id: string;
  title: string;
  content: string;
  image: string;
  author?: string;
}

export interface OtherLinkItem {
  id: string;
  title: string;
  url: string;
  category?: string;
  icon?: string;
}

export interface UpdateItem {
  title: string;
  updates: string[];
}

interface SectionsPageProps {
  data: {
    carousel?: CarouselItem[];
    announcements?: AnnouncementItem[];
    quickLinks?: QuickLinkItem[];
    accreditations?: AccreditationItem[];
    stats?: StatItem[];
    successStories?: SuccessStoryItem[];
    otherLinks?: OtherLinkItem[];
    updates?: UpdateItem;
  }
}

export function SectionsPage({ data }: SectionsPageProps) {
  const [activeTab, setActiveTab] = useState<string | null>('carousel');
  
  return (
    <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="carousel">Carousel</Tabs.Tab>
        <Tabs.Tab value="announcements">Announcements</Tabs.Tab>
        {/* <Tabs.Tab value="quickLinks">Quick Links</Tabs.Tab>  */}
        <Tabs.Tab value="updates">Updates</Tabs.Tab>
        <Tabs.Tab value="accreditations">Accreditations</Tabs.Tab>
        <Tabs.Tab value="stats">Statistics</Tabs.Tab>
        <Tabs.Tab value="successStories">Success Stories</Tabs.Tab>
        <Tabs.Tab value="otherLinks">Other Links</Tabs.Tab>
      </Tabs.List>
      
      <Box p="md">
        <Tabs.Panel value="carousel">
          <CarouselSection data={data?.carousel || []} />
        </Tabs.Panel>
        <Tabs.Panel value="announcements">
          <AnnouncementSection data={data?.announcements || []} />
        </Tabs.Panel>
        {/* <Tabs.Panel value="quickLinks">
          <QuickLinksSection data={data?.quickLinks || []} />
        </Tabs.Panel> */}
        <Tabs.Panel value="accreditations">
          <AccreditationsSection data={data?.accreditations || []} />
        </Tabs.Panel>
        <Tabs.Panel value="stats">
          <StatsSection data={data?.stats || []} />
        </Tabs.Panel>
        <Tabs.Panel value="successStories">
          <SuccessStoriesSection data={data?.successStories || []} />
        </Tabs.Panel>
        <Tabs.Panel value="otherLinks">
          <OtherLinksSection data={data?.otherLinks || []} />
        </Tabs.Panel>
        <Tabs.Panel value="updates">
          <UpdatesSection data={data?.updates} />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
}
import { AppShell, Burger, Group, Skeleton, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function AppShellHeader({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Departments', path: '/departments' },
    { label: 'Amenities', path: '/amenities' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Research', path: '/research' },
    { label: 'Campus Life', path: '/campus-life' },
    { label: 'Placements', path: '/placements' },
    { label: 'Contacts', path: '/contact' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 150,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {links.map((link, index) => (
          <NavLink
            key={index}
            label={link.label}
            href={link.path}
            mt="sm"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
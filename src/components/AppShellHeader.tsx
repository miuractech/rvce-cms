import { AppShell, Burger, Group, NavLink } from '@mantine/core';
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
    { label: 'Key Executives', path: '/key-executives' },
    { label: 'Research', path: '/research' },
    { label: 'Campus Life', path: '/campus-life' },
    { label: 'Placements', path: '/placements' },
    { label: 'Contacts', path: '/contact' },
    { label: 'Blog', path: '/blog' },
    { label: 'Student Activities', path: '/student-activities' },
    { label: 'Media', path: '/media' },
    { label: 'Center of Excellence', path: '/center-of-excellence' },
    { label: 'Center of Competencies', path: '/center-of-competencies' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Top Certification', path: '/top-certification' },
    { label: 'Innovative Clubs', path: '/innovative-clubs' },
    { label: 'Fee Payment Curricular', path: '/fee-payment-curricular' },
    { label: 'Examination Curriculars', path: '/examination-curriculars' },
    { label: 'Student Achievements', path: '/student-achievements' }
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
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

      <AppShell.Navbar p="md" style={{ overflow: 'auto' }}>
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
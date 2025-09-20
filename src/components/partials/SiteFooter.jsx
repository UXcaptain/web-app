import { Box, Container, SimpleGrid, Stack, Group, Divider, Image, Text, Anchor, ActionIcon } from '@mantine/core';

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Docs', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Cookies', href: '#' },
      ],
    },
  ];

  return (
    <Box component="footer" role="contentinfo" aria-label="Site footer" p="xl">
      <Container size="xl">
        <SimpleGrid
          cols={5}
          spacing="xl"
          breakpoints={[
            { maxWidth: 'lg', cols: 4, spacing: 'xl' },
            { maxWidth: 'md', cols: 3, spacing: 'lg' },
            { maxWidth: 'sm', cols: 1, spacing: 'md' },
          ]}
        >
          <Stack gap="xs">
            <Group gap="sm" align="center" wrap="nowrap">
              <Image src="/logo.svg" alt="Company logo" w={36} h={36} />
              <Text fw={700} fz="lg">
                ProductName
              </Text>
            </Group>
            <Text c="dimmed" fz="sm">
              Making insights accessible with privacy-first analytics.
            </Text>
          </Stack>

          {columns.map((col) => (
            <Stack key={col.title} gap={6}>
              <Text fw={700} fz="sm">
                {col.title}
              </Text>
              {col.links.map((link) => (
                <Anchor
                  key={link.label}
                  href={link.href}
                  c="dimmed"
                  size="sm"
                  underline="hover"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my="lg" />

        <Group justify="space-between" wrap="wrap" gap="md">
          <Text c="dimmed" fz="sm">
            © {year} ProductName, Inc. All rights reserved.
          </Text>

          <Group gap="md" wrap="wrap">
            <Anchor href="#" c="dimmed" size="sm" underline="hover">
              Privacy policy
            </Anchor>
            <Anchor href="#" c="dimmed" size="sm" underline="hover">
              Terms of service
            </Anchor>
            <Anchor href="#" c="dimmed" size="sm" underline="hover">
              Cookie policy
            </Anchor>

            <Group gap="xs">
              <ActionIcon
                component="a"
                href="#"
                variant="subtle"
                color="gray"
                aria-label="Visit our GitHub"
              >
                <Text fz="xs">GH</Text>
              </ActionIcon>
              <ActionIcon
                component="a"
                href="#"
                variant="subtle"
                color="gray"
                aria-label="Visit our LinkedIn"
              >
                <Text fz="xs">in</Text>
              </ActionIcon>
              <ActionIcon
                component="a"
                href="#"
                variant="subtle"
                color="gray"
                aria-label="Visit our X profile"
              >
                <Text fz="xs">X</Text>
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
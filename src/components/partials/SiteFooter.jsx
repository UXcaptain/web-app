import { Box, Container, SimpleGrid, Stack, Group, Divider, Image, Text, Anchor, ActionIcon } from '@mantine/core';
import classes from './SiteFooter.module.css';

export const SiteFooter = () => {
  
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Producto',
      links: [
        { label: 'Precio', href: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Estado del servicio', href: 'https://uptime.uxcaptain.com/status/uxcaptain' },
      ],
    },

    {
      title: 'Legal',
      links: [
        { label: 'Términos y condiciones', href: '/terminos-condiciones' },
        { label: 'Contacto', href: 'mailto:s.navarroredondo@gmail.com' },

      ],
    },
  ];

  return (
    <Box component="footer" role="contentinfo" aria-label="Site footer" p="xl" className={classes.footer}>
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
                UXcaptain
              </Text>
            </Group>
            <Text c="dimmed" fz="sm">
              UXcaptain te muestra qué funciona en tu producto… y qué no. Una herramienta sencilla con la que puedes crear un análisis con usuarios no moderados en minutos y recibir resultados en solo unas horas..
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
            © {year} UXcaptain. Todos los derechos reservados.
          </Text>

          
        </Group>
      </Container>
    </Box>
  );
}
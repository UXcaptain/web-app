import { Container, Title, Group } from '@mantine/core';
import { IconBrandTwitter, IconBrandFacebook, IconBrandGoogle, IconBrandApple } from '@tabler/icons-react';

const CompaniesLogoStrip = () => {
  // Sample company logos - in a real app, these would be imported images
  const companies = [
    { id: 1, name: 'Company A', icon: IconBrandTwitter },
    { id: 2, name: 'Company B', icon: IconBrandFacebook },
    { id: 3, name: 'Company C', icon: IconBrandGoogle },
    { id: 4, name: 'Company D', icon: IconBrandApple },
  ];

  return (
    <Container size="lg" py="xl">
      <Group justify="center" gap="xl">
        {companies.map((company) => {
          const IconComponent = company.icon;
          return (
            <IconComponent
              key={company.id}
              size={48}
              color="gray"
              style={{ opacity: 0.7 }}
            />
          );
        })}
      </Group>
      <Title order={4} ta="center" mt="md" c="dimmed" fw={500} size="sm">
        Profesionales de UX de decenas de empresas ya utilizan UXcaptain 
      </Title>
    </Container>
  );
};

export default CompaniesLogoStrip;
import { Container, Title, Text, Card, Group, Badge, List, ThemeIcon, Stack } from '@mantine/core';
import RegisterButton from '../../components/navBarElements/RegisterButton.jsx';

export const PricingPage = () => {
 return (
   <Container py="xl" size="lg">
     <Stack align="center" gap="xl">
       <div style={{ textAlign: 'center' }}>
         <Title order={2}>Planes y precios</Title>
         <Text c="dimmed" mt="xs" style={{ maxWidth: 640, marginInline: 'auto' }}>
           Un único plan simple para empezar hoy mismo. Sin complicaciones, cancela cuando quieras.
         </Text>
       </div>

       <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: '100%', maxWidth: 420 }}>
         <Group justify="space-between" align="center" mb="md">
           <Title order={3} m={0}>Plan Único</Title>
           <Badge size="lg" variant="light" color="blue">29€ / mes</Badge>
         </Group>

         <Text c="dimmed" size="sm" mb="md">
           Todo lo que necesitas para empezar a trabajar con nuestra plataforma.
         </Text>

         <List spacing="sm" size="sm" center>
           <List.Item
             icon={
               <ThemeIcon size={20} radius="xl" color="green">
                 ✓
               </ThemeIcon>
             }
           >
             5 proyectos activos
           </List.Item>
           <List.Item
             icon={
               <ThemeIcon size={20} radius="xl" color="green">
                 ✓
               </ThemeIcon>
             }
           >
             Exportaciones ilimitadas
           </List.Item>
           <List.Item
             icon={
               <ThemeIcon size={20} radius="xl" color="green">
                 ✓
               </ThemeIcon>
             }
           >
             Colaboración con hasta 3 miembros
           </List.Item>
           <List.Item
             icon={
               <ThemeIcon size={20} radius="xl" color="green">
                 ✓
               </ThemeIcon>
             }
           >
             Soporte por email prioritario
           </List.Item>
           <List.Item
             icon={
               <ThemeIcon size={20} radius="xl" color="green">
                 ✓
               </ThemeIcon>
             }
           >
             Historial y auditoría de cambios
           </List.Item>
         </List>

         <div style={{ margin: '20px 0' }}>
           <RegisterButton />
         </div>
       </Card>
     </Stack>
   </Container>
 );
};
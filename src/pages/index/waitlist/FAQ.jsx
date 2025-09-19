import { Container, Title, Accordion, Group, Anchor } from '@mantine/core';
import { IconHelpHexagon } from '@tabler/icons-react';

const WaitlistFAQ = () => (
  <Container size="lg" py="xl">
    <Title order={2} ta="center" mb="xl">
      Preguntas frecuentes
    </Title>
    <Accordion variant="separated">

      <Accordion.Item value="availability">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cuándo estará disponible?
        </Accordion.Control>
        <Accordion.Panel>
          ¡Pronto! Actualmente estamos en fase beta - Si quieres ser de los primeros en probar la herramienta, únete al waitlist. 
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="analysis-time">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cuánto se tarda en preparar un análisis?
        </Accordion.Control>
        <Accordion.Panel>
          El tiempo de preparación de un análisis depende del alcance del estudio y la complejidad de los datos que se desean recolectar. Generalmente, puede tardar desde unas pocas horas para un análisis básico hasta varios días si se requiere configurar preguntas personalizadas, reclutamiento de participantes y revisión de vídeos.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="how-it-works">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cómo funciona?
        </Accordion.Control>
        <Accordion.Panel>
          Utilizando la plataforma, podrás crear un análisis en menos de 10 minutos. Una vez lo lances, podrás invitar a tus participantes, que grabarán su pantalla y voz mientrás completan las tareas que hayas definido.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="receive">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Qué recibiré?
        </Accordion.Control>
        <Accordion.Panel>
          Recibirás una grabación de pantalla con audio y video por cada participante, en el que podrás observar cómo completan las tareas que has definido mientras comentan su feedback y pensamientos en voz alta.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="recruit">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cómo recluto participantes a los participantes?
        </Accordion.Control>
        <Accordion.Panel>
         ¡Tu decides! - Puedes invitar a a tus tests a quien quieras, tus clientes, en redes sociales, o incluso tu equipo interno - Simplemente comparte el enlace de tu análisis con ellos 
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="participants-number">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cuántos participantes necesito para obtener resultados?
        </Accordion.Control>
        <Accordion.Panel>
          5 participantes son suficientes para identificar hasta un 85% de los problemas de usabilidad.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="platforms-web">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Puedo probar mi página web?
        </Accordion.Control>
        <Accordion.Panel>
          ¡Si! Puedes probar cualquier página web que sea accesible desde un enlace público - incluso tus diseños de Figma o herramienta de diseño preferida
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="platforms-app">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Puedo probar mi aplicación móvil?
        </Accordion.Control>
        <Accordion.Panel>
          Lamentablemente, no - Estamos trabajando en una aplicación móvil para que pronto puedas probar tus aplicaciones móviles.
        </Accordion.Panel>
      </Accordion.Item>

      

    </Accordion>

    {/* <Group justify="center" mt="xl">
      <Anchor href="/preguntas-frecuentes" size="sm">
        Ver todas las preguntas
      </Anchor>
    </Group> */}
  </Container>
);

export default WaitlistFAQ;
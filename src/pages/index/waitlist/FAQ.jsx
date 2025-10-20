import { Container, Title, Accordion, Group, Anchor } from '@mantine/core';
import { IconHelpHexagon } from '@tabler/icons-react';

const WaitlistFAQ = () => (
  <Container size="lg" py="xl">
    <Title order={2} ta="center" mb="xl">
      Preguntas frecuentes
    </Title>
    <Accordion variant="separated">

      <Accordion.Item value="analysis-time">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cuánto tardaré en preparar un análisis?
        </Accordion.Control>
        <Accordion.Panel>
          Es muy sencillo - En menos de 5 minutos puedes añadir tantas preguntas como quieras y lanzar tu análisis.
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
          Recibirás una grabación de pantalla con audio y video por cada participante, en el que podrás observar cómo completan las tareas que has definido mientras comparten su feedback y pensamientos en voz alta.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="recruit">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          ¿Cómo recluto a los participantes?
        </Accordion.Control>
        <Accordion.Panel>
         ¡Tu decides! - Puedes invitar a tus análisis a quien quieras, tus clientes, en redes sociales, o incluso tu equipo interno - Simplemente comparte el enlace de tu análisis con ellos. 
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
          Lamentablemente, aún no - Estamos trabajando en una aplicación móvil para que pronto puedas probar tus aplicaciones móviles.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="more-questions">
        <Accordion.Control icon={<IconHelpHexagon size={16} />}>
          Tengo más preguntas ¿Os puedo contactar?
        </Accordion.Control>
        <Accordion.Panel>
          ¡Claro! - Únete a nuestro <Anchor href="https://join.slack.com/t/uxcaptainespacio/shared_invite/zt-3c8lqp7nb-0OORUPkQ20A2oiquV13kUQ?utm_source=brevo&utm_campaign=welcome_waitlist&utm_medium=email&utm_id=4">Slack</Anchor>, <Anchor href="https://discord.gg/VcwNV9rjpy">Discord</Anchor> o por <Anchor href="https://api.whatsapp.com/send?phone=34679146035&text=%C2%A1Hola!%20Me%20encantar%C3%ADa%20probar%20la%20beta%20de%20UXcaptain&utm_source=brevo&utm_campaign=welcome_waitlist&utm_medium=email&utm_id=4">Whatsapp</Anchor>. Estaremos encantados de hablar contigo
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
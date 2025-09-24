import { Modal, Button, Text, Stack } from "@mantine/core";
import PropTypes from "prop-types";

export const SecurityModal = ({ opened, onAccept, onDecline }) => {
  return (
    <Modal opened={opened} onClose={onDecline} title="Confirmación de Seguridad" size="md">
      <Stack spacing="md">
        <Text>
          Estás a punto de participar en una sesión de análisis grabada. Ten en cuenta:
        </Text>
        <Text size="sm">
          • Tu pantalla y audio serán grabados durante esta sesión
        </Text>
        <Text size="sm">
          • La grabación se utilizará únicamente con fines de investigación
        </Text>
        <Text size="sm">
          • Cualquier información que se muestre en pantalla quedará grabada - Procura no mostrar información confidencial
        </Text>
        <Text size="sm">
          • Puedes dejar de participar en el análisis y eliminar la grabación en cualquier momento pulsando sobre "Salir del análisis"
        </Text>

        <Text mt="md" weight={500}>
          ¿Aceptas estos términos y deseas continuar?
        </Text>
        
        <Stack direction="row" spacing="sm" mt="md">
          <Button onClick={onAccept} color="green">
            Aceptar y Continuar
          </Button>
          <Button onClick={onDecline} variant="outline" color="red">
            Rechazar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

SecurityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};
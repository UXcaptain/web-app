import { Container, Title, Text, List, ListItem, Divider, Paper, Stack, Anchor } from '@mantine/core';

const TerminosCondiciones = () => {
    return (
        <Container size="md" py="xl">
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="lg">

                    <Title order={1}>Términos y Condiciones de Uso</Title>

                    <Title order={2}>1. Objeto</Title>
                    <Text>
                        Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma de investigación de usuarios (en adelante, "la Plataforma"), cuyo propósito es facilitar pruebas de usabilidad y grabaciones en video entre empresas, organizaciones o investigadores ("Clientes") y personas voluntarias que participan en dichas pruebas ("Participantes").
                    </Text>
                    <Text>
                        Al registrarse y utilizar la Plataforma, el usuario acepta plenamente y sin reservas estos Términos y Condiciones.
                    </Text>

                    <Title order={2}>2. Naturaleza del servicio</Title>
                    <Text>
                        La Plataforma ofrece herramientas de grabación, almacenamiento y análisis de sesiones de investigación de usuarios.
                    </Text>
                    <Text>
                        La principal diferencia respecto a otros servicios similares es que <strong>los Participantes no reciben contraprestación económica, descuentos ni retribución alguna</strong> por su participación por parte de la Plataforma. El Cliente podrá ofrecer la contraprestación que considere oportuna utilizando sus propios medios.
                    </Text>

                    <Title order={2}>3. Registro y cuentas de usuario</Title>
                    <List withPadding>
                        <ListItem>Los Clientes deben crear una cuenta para poder gestionar estudios, invitar participantes y acceder al material grabado.</ListItem>
                        <ListItem>Los Participantes pueden ser invitados por los Clientes.</ListItem>
                        <ListItem>Cada Cliente es responsable de la veracidad de los datos proporcionados y de la seguridad de sus credenciales de acceso.</ListItem>
                    </List>

                    <Title order={2}>4. Cancelación y eliminación de cuentas</Title>
                    <Text>
                        Los Usuarios (Clientes y Participantes) podrán solicitar la cancelación de su cuenta en cualquier momento. Tras la cancelación, todos los datos personales y grabaciones asociadas serán eliminados de forma definitiva, salvo obligación legal de conservación o mandato judicial.
                    </Text>

                    <Title order={2}>5. Derechos y responsabilidades de los Clientes</Title>
                    <List withPadding>
                        <ListItem>Los Clientes son responsables de definir las pruebas y comunicar claramente a los Participantes lo que se espera de ellos.</ListItem>
                        <ListItem>No se permite solicitar ni recolectar información confidencial, sensible o privada (por ejemplo, contraseñas, datos bancarios, información médica).</ListItem>
                        <ListItem>Los Clientes conservarán únicamente los videos y datos necesarios para la investigación, garantizando un uso responsable, ético y conforme a la normativa vigente.</ListItem>
                        <ListItem>La Plataforma se reserva el derecho de no procesar estudios relacionados con contenido sensible y/o prohibido (por ejemplo, pornografia, apuestas electrónicas, etc).</ListItem>
                    </List>

                    <Title order={2}>6. Derechos y responsabilidades de los Participantes</Title>
                    <List withPadding>
                        <ListItem>La participación es totalmente voluntaria y sin incentivo económico por parte de la Plataforma.</ListItem>
                        <ListItem>El Participante puede interrumpir la sesión en cualquier momento y solicitar la eliminación de su grabación en curso.</ListItem>
                        <ListItem>El Participante declara tener más de 18 años y actuar de manera libre y consciente al aceptar colaborar en el estudio.</ListItem>
                    </List>

                    <Title order={2}>7. Prohibición y control de participación de menores de edad</Title>
                    <Text>
                        Queda prohibida la inscripción y participación de menores de 18 años en la Plataforma. Si se detecta que un usuario es menor de edad, se procederá a la eliminación inmediata de sus datos y la cancelación de su cuenta.
                    </Text>

                    <Title order={2}>8. Propiedad intelectual</Title>
                    <Text>
                        Los videos, grabaciones y aportaciones realizadas por los Participantes en el marco de un estudio pasarán a ser propiedad del Cliente únicamente para los fines de investigación de experiencia de usuario.
                    </Text>
                    <Text>
                        La Plataforma no reclama derechos de propiedad sobre dichos materiales, limitándose a proveer soporte técnico y almacenamiento.
                    </Text>
                    <Text>
                        La Plataforma podrá utilizar con fines de marketing el contenido del Cliente bajo autorización expresa por parte del Cliente.
                    </Text>

                    <Title order={2}>9. Privacidad y protección de datos</Title>
                    <List withPadding>
                        <ListItem>Los datos personales se recopilarán y procesarán de acuerdo con la normativa de protección de datos aplicable (como el Reglamento General de Protección de Datos – RGPD).</ListItem>
                        <ListItem>Los Clientes podrán ejercer sus derechos de acceso, rectificación, supresión y portabilidad mediante contacto con el administrador de la Plataforma.</ListItem>
                        <ListItem>La Plataforma aplica medidas de seguridad técnicas y organizativas para proteger la confidencialidad e integridad de los datos.</ListItem>
                    </List>

                    <Title order={2}>10. Consentimiento explícito de datos personales y grabaciones</Title>
                    <Text>
                        Antes de iniciar cualquier sesión de prueba o grabación, la Plataforma solicitará el consentimiento explícito de los Participantes mediante una acción afirmativa (por ejemplo, casilla de aceptación previa al acceso al estudio), informando claramente sobre el uso, tratamiento y finalidad de sus datos personales y grabaciones. El Participante podrá revocar este consentimiento en cualquier momento y solicitar la eliminación de sus datos y videos asociados conforme al RGPD.
                    </Text>

                    <Title order={2}>11. Información sobre ubicación y tratamiento de datos</Title>
                    <Text>
                        Los datos personales y grabaciones serán almacenados en servidores situados en la Unión Europea o países con garantía adecuada conforme al RGPD. La Plataforma podrá contratar servicios tecnológicos de terceros que cumplan los mismos estándares de protección y seguridad de datos, informando al usuario en la Política de Privacidad.
                    </Text>

                    <Title order={2}>12. Política de cookies y tecnologías de seguimiento</Title>
                    <Text>
                        La Plataforma utiliza cookies y tecnologías similares para mejorar la experiencia de usuario, analizar la actividad y proteger la seguridad del servicio. Al acceder y utilizar la Plataforma, el usuario acepta el uso de cookies.
                    </Text>

                    <Text>
                        La Plataforma utiliza un numero muy reducido de cookies enmarcados en el derecho de recolección  de interés legítimo.
                    </Text>

                    <Title order={2}>13. Limitación de responsabilidad</Title>
                    <List withPadding>
                        <ListItem>La Plataforma no se hace responsable del contenido de los estudios definidos por los Clientes ni de las interacciones entre Clientes y Participantes.</ListItem>
                        <ListItem>La Plataforma podrá suspender o cancelar cuentas que hagan un uso indebido, ilegal o fraudulento del servicio.</ListItem>
                        <ListItem>El uso de la Plataforma se ofrece "tal cual", sin garantías de disponibilidad ininterrumpida ni de idoneidad para un propósito específico.</ListItem>
                    </List>

                    <Title order={2}>14. Responsabilidad ante contenido ilegal o uso indebido</Title>
                    <Text>
                        El Cliente y el Participante se comprometen a no utilizar la Plataforma para la difusión de contenido ilegal, ofensivo, difamatorio o que infrinja derechos de terceros. La Plataforma cooperará con autoridades ante posibles denuncias y podrá suspender cuentas implicadas en conductas ilícitas. Queda terminantemente prohibida la grabación de menores sin consentimiento y el uso de material protegido por derechos de autor sin permiso.
                    </Text>

                    <Title order={2}>15. Niveles de servicio y soporte</Title>
                    <Text>
                        La Plataforma proporciona soporte técnico básico a través de correo electrónico (support@uxcaptain.com). Los tiempos de respuesta habituales son de hasta 72 horas laborables, sin garantizar solución inmediata salvo incidencias graves que puedan afectar a la operatividad general del servicio.
                    </Text>

                    <Title order={2}>16. Modificaciones</Title>
                    <Text>
                        La Plataforma se reserva el derecho a modificar en cualquier momento los presentes Términos y Condiciones.
                    </Text>
                    <Text>
                        Las modificaciones entrarán en vigor desde su publicación en el sitio web. El uso continuado del servicio implica la aceptación de dichos cambios.
                    </Text>

                    <Title order={2}>17. Legislación aplicable</Title>
                    <Text>
                        Estos Términos y Condiciones se rigen por la legislación vigente en España.
                    </Text>
                    <Text>
                        Cualquier conflicto derivado de su interpretación o ejecución será resuelto ante los tribunales competentes de Madrid, salvo disposición legal en contrario.
                    </Text>

                </Stack>
            </Paper>
        </Container>
    );
};

export default TerminosCondiciones;
import { Paper } from "@mantine/core";
import { ParticipateForm } from "../ParticipateForm";
import { Instructions } from "../../../components/partials/Instructions";

export const FormStep = ({ onSubmitId, defaultValue = "", loading }) => {
  return (
    <>
      <Instructions phase="setup" />
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <ParticipateForm
          onSubmitId={onSubmitId}
          loading={loading}
          defaultValue={defaultValue}
        />
      </Paper>
    </>
  );
};
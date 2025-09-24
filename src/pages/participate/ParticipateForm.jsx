import { useState } from "react";
import PropTypes from "prop-types";
import { Button, TextInput } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

// Pure input + submit component. API calls and rendering of analysis data/timer
// are handled by the wrapper.
export const ParticipateForm = ({ onSubmitId, loading = false, defaultValue = "" }) => {
  const [analysisId, setAnalysisId] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmitId === "function") {
      onSubmitId(analysisId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="ID de Análisis"
        placeholder="Introduce el ID del análisis"
        value={analysisId}
        onChange={(e) => setAnalysisId(e.target.value)}
        disabled={loading}
        required
      />

      <Button
        type="submit"
        fullWidth
        mt="xl"
        leftSection={<IconPlayerPlay size={14} />}
        loading={loading}
      >
        {loading ? "Cargando..." : "Participar"}
      </Button>
    </form>
  );
};

ParticipateForm.propTypes = {
  onSubmitId: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  defaultValue: PropTypes.string,
};
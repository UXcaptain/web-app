import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Text, TextInput } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Link } from "react-router";

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
     <Text size="sm" c="dimmed" className="terms-and-conditions" style={{ textAlign: 'center', marginTop: '10px' }}>
       Al participar, aceptas estar de acuerdo con los{" "}
       <Link to="/terminos-condiciones">términos y condiciones</Link>
     </Text>
    </form>
  );
};

ParticipateForm.propTypes = {
  onSubmitId: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  defaultValue: PropTypes.string,
};
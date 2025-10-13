import { useNavigate } from "react-router";
import { Button, Tooltip } from '@mantine/core';
import { useSubscription } from '../../contexts/SubscriptionContext.jsx';

export const CreateNewAnalysisButton = () => {
  const navigate = useNavigate();
  const { hasActiveSubscription, loading } = useSubscription();

  const disabled = !hasActiveSubscription && !loading;

  const handleClick = () => {
    if (!disabled) {
      navigate('/analysis/create');
    }
  };

  const tooltipLabel = 'Debes tener una suscripción activa para poder crear análisis.';

  return (
    <Tooltip
      withinPortal
      withArrow
      disabled={!disabled}
      label={tooltipLabel}
    >
      <span style={{ display: 'inline-block' }}>
        <Button
          onClick={handleClick}
          disabled={disabled}
          loading={loading}
        >
          Crear nuevo análisis
        </Button>
      </span>
    </Tooltip>
  );
}
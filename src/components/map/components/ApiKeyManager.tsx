
import React from 'react';
import MapApiKeyInput from '../MapApiKeyInput';

interface ApiKeyManagerProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onApiKeySubmit: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKey,
  setApiKey,
  onApiKeySubmit,
}) => {
  return (
    <MapApiKeyInput
      apiKey={apiKey}
      onApiKeyChange={setApiKey}
      onSubmit={onApiKeySubmit}
      testMode={false}
      onSkip={() => onApiKeySubmit()}
    />
  );
};

export default ApiKeyManager;

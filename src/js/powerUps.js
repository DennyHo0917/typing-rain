export const powerUpTypes = {
  easyMode: {
    name: 'Easy Mode',
    description: 'Slows falling words without changing spelling rules.',
  },
};

export function getLocalizedPowerUpName(key) {
  return key === 'easyMode' ? 'Easy Mode' : key;
}

export function generatePowerUp() {}

export function usePowerUp() {}

export function updatePowerUps() {}

if (typeof window !== 'undefined') {
  window.powerUpTypes = powerUpTypes;
  window.powerUpsBridge = {
    powerUpTypes,
    generatePowerUp,
    usePowerUp,
    updatePowerUps,
  };
}

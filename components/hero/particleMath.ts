export interface ParticleTarget {
  t: number;
  mx: number;
  my: number;
  mz: number;
  cz: number;
  randomRadiusOffset: number;
}

export interface RingParams {
  magnetRadius: number;
  ringRadius: number;
  waveSpeed: number;
  waveAmplitude: number;
  fieldStrength: number;
  depthFactor: number;
  globalRotation: number;
}

export function computeTargetPosition(
  particle: ParticleTarget,
  targetX: number,
  targetY: number,
  params: RingParams
): { x: number; y: number; z: number } {
  const { mx, my, mz, cz, t, randomRadiusOffset } = particle;
  const { magnetRadius, ringRadius, waveSpeed, waveAmplitude, fieldStrength, depthFactor, globalRotation } = params;

  const projectionFactor = 1 - cz / 50;
  const projectedTargetX = targetX * projectionFactor;
  const projectedTargetY = targetY * projectionFactor;

  const dx = mx - projectedTargetX;
  const dy = my - projectedTargetY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist >= magnetRadius) {
    return { x: mx, y: my, z: mz * depthFactor };
  }

  const angle = Math.atan2(dy, dx) + globalRotation;
  const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
  const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
  const currentRingRadius = ringRadius + wave + deviation;

  return {
    x: projectedTargetX + currentRingRadius * Math.cos(angle),
    y: projectedTargetY + currentRingRadius * Math.sin(angle),
    z: mz * depthFactor + Math.sin(t) * (waveAmplitude * depthFactor),
  };
}

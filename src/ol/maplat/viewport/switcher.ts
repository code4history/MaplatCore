/**
 * @module ol/maplat/viewport/switcher
 */
import { Coordinate } from 'ol/coordinate';
import {transform} from 'ol/proj.js';

const thetas = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75].map((pow: number) => pow * Math.PI);

function center2Vicinities(center: number[], radius: number): number[][] {
  const vicinities = thetas.map((theta: number) => [
    center[0] + Math.sin(theta) * radius,
    center[1] + Math.cos(theta) * radius,
  ]);
  vicinities.unshift(center);
  return vicinities;
}

function normalizeAngle(theta: number): number {
  while (theta > Math.PI || theta <= -Math.PI) {
    theta = theta > Math.PI ? theta - 2 * Math.PI : theta + 2 * Math.PI;
  }
  return theta;
}

function switcher(
  fromCenter: number[],
  fromRotation: number,
  fromResolution: number,
  baseRadius: number,
  fromProj: string,
  toProj: string,
  baseProj = 'EPSG:3857'
) {
  let midCenter = fromCenter,
    midRotation = fromRotation,
    midResolution = fromResolution;
  if (fromProj != baseProj) {
    [midCenter, midRotation, midResolution] = maplat2Base(
      fromCenter,
      fromRotation,
      fromResolution,
      baseRadius,
      fromProj,
      baseProj
    );
  }
  if (toProj != baseProj) {
    return base2Maplat(
      midCenter,
      midRotation,
      midResolution,
      baseRadius,
      toProj,
      baseProj
    );
  }
  return [midCenter, midRotation, midResolution];
}

function maplat2Base(
  maplatCenter: number[],
  maplatRotation: number,
  maplatResolution: number,
  baseRadius: number,
  maplatProj: string,
  baseProj = 'EPSG:3857'
): [number[], number, number] {
  const baseCenter = transform(maplatCenter, maplatProj, baseProj);
  const maplatParams = base2MaplatParams(
    baseCenter,
    baseRadius,
    maplatProj,
    baseProj
  );
  const baseResolution = (maplatResolution * baseRadius) / maplatParams[2];
  const baseRotation = normalizeAngle(maplatRotation + maplatParams[1]);
  return [baseCenter, baseRotation, baseResolution];
}

function base2Maplat(
  baseCenter: number[],
  baseRotation: number,
  baseResolution: number,
  baseRadius: number,
  maplatProj: string,
  baseProj = 'EPSG:3857'
) {
  const maplatParams = base2MaplatParams(
    baseCenter,
    baseRadius,
    maplatProj,
    baseProj
  );
  const maplatCenter = maplatParams[0];
  const maplatResolution = (baseResolution * maplatParams[2]) / baseRadius;
  const maplatRotation = normalizeAngle(baseRotation - maplatParams[1]);
  return [maplatCenter, maplatRotation, maplatResolution];
}

function base2MaplatParams(center: number[], radius: number, maplatProj: string, baseProj: string): [number[], number, number] {
  const maplatVicinities = center2Vicinities(center, radius).map(
    (baseCoord: number[]) => transform(baseCoord, baseProj, maplatProj));
  const maplatCenter = maplatVicinities.shift()!;
  const maplatParams = maplatVicinities
    .map((maplatCoord, index) => {
      const vacinity = [
        maplatCoord[0] - maplatCenter[0],
        maplatCoord[1] - maplatCenter[1],
      ];
      const theta = Math.atan2(vacinity[0], vacinity[1]);
      const distance = Math.sqrt(
        Math.pow(vacinity[0], 2) + Math.pow(vacinity[1], 2)
      );
      return [normalizeAngle(theta - thetas[index]), distance];
    })
    .reduce((prev: (Coordinate | number)[] | null, curr: number[], index: number) => {
      const thetax = Math.cos(curr[0]);
      const thetay = Math.sin(curr[0]);
      const dist = curr[1];
      if (!prev) {
        return [thetax, thetay, dist];
      }
      prev[0] = prev[0] as number + thetax;
      prev[1] = prev[1] as number + thetay;
      prev[2] = prev[2] as number + dist;
      if (index == 7) {
        return [maplatCenter, Math.atan2(prev[1], prev[0]), prev[2] / 8];
      }
      return prev;
    }, null) as [number[], number, number];
  return maplatParams;
}

export default switcher;

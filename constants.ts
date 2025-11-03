import type { ComponentConfig, Disaster } from './types';
import { BuildingComponentId, DisasterId, MaterialTypeId } from './types';
import { TsunamiIcon, HurricaneIcon, EarthquakeIcon } from './components/Icons';

export const COMPONENT_CONFIG: Record<BuildingComponentId, ComponentConfig> = {
  [BuildingComponentId.Roof]: {
    label: 'Teto',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Gesso', resistance: 10, color: 'bg-[#E0E0E0]' },
      [MaterialTypeId.Medium]: { name: 'PVC', resistance: 40, color: 'bg-[#CFCFCF]' },
      [MaterialTypeId.Strong]: { name: 'Laje Maciça', resistance: 60, color: 'bg-[#BFBFBF]' },
    },
  },
  [BuildingComponentId.Walls]: {
    label: 'Paredes',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Tijolo Comum', resistance: 20, color: 'bg-[#B55239]' },
      [MaterialTypeId.Medium]: { name: 'Drywall', resistance: 40, color: 'bg-[#EFEFEF]' },
      [MaterialTypeId.Strong]: { name: 'Alvenaria Estrutural', resistance: 70, color: 'bg-[#A6A6A6]' },
    },
  },
  [BuildingComponentId.Pillars]: {
    label: 'Pilares',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Pilar de Madeira', resistance: 10, color: 'bg-[#8B5A2B]' },
      [MaterialTypeId.Medium]: { name: 'Pilar de Aço', resistance: 20, color: 'bg-[#9E9E9E]' },
      [MaterialTypeId.Strong]: { name: 'Pilar de Concreto Armado', resistance: 40, color: 'bg-[#8C8C8C]' },
    },
  },
  [BuildingComponentId.Beams]: {
    label: 'Vigas',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Viga de Madeira', resistance: 20, color: 'bg-[#A66A3B]' },
      [MaterialTypeId.Medium]: { name: 'Viga de Aço', resistance: 50, color: 'bg-[#A9A9A9]' },
      [MaterialTypeId.Strong]: { name: 'Viga de Concreto', resistance: 70, color: 'bg-[#707070]' },
    },
  },
  [BuildingComponentId.Floor]: {
    label: 'Piso',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Porcelanato', resistance: 30, color: 'bg-[#F5F5F5]' },
      [MaterialTypeId.Medium]: { name: 'Cerâmica', resistance: 40, color: 'bg-[#C97B4C]' },
      [MaterialTypeId.Strong]: { name: 'Vinílico', resistance: 50, color: 'bg-[#D8B187]' },
    },
  },
  [BuildingComponentId.Glass]: {
    label: 'Vidros',
    materials: {
      [MaterialTypeId.Weak]: { name: 'Vidro Comum', resistance: 10, color: 'bg-slate-600/50' },
      [MaterialTypeId.Medium]: { name: 'Vidro Temperado', resistance: 20, color: 'bg-slate-500/60' },
      [MaterialTypeId.Strong]: { name: 'Vidro Blindado', resistance: 30, color: 'bg-slate-400/70' },
    },
  },
};

export const DISASTER_CONFIG: Record<DisasterId, Disaster> = {
  [DisasterId.Hurricane]: {
    label: 'Furacão',
    power: 75,
    Icon: HurricaneIcon,
  },
  [DisasterId.Tsunami]: {
    label: 'Tsunami',
    power: 85,
    Icon: TsunamiIcon,
  },
  [DisasterId.Earthquake]: {
    label: 'Terremoto',
    power: 115,
    Icon: EarthquakeIcon,
  },
};

export const INITIAL_BUILDING_STATE: import('./types').BuildingState = {
  [BuildingComponentId.Roof]: MaterialTypeId.Weak,
  [BuildingComponentId.Walls]: MaterialTypeId.Weak,
  [BuildingComponentId.Pillars]: MaterialTypeId.Weak,
  [BuildingComponentId.Beams]: MaterialTypeId.Weak,
  [BuildingComponentId.Floor]: MaterialTypeId.Weak,
  [BuildingComponentId.Glass]: MaterialTypeId.Weak,
};

export const INITIAL_HEALTH_STATE: import('./types').ComponentHealth = {
  [BuildingComponentId.Roof]: 100,
  [BuildingComponentId.Walls]: 100,
  [BuildingComponentId.Pillars]: 100,
  [BuildingComponentId.Beams]: 100,
  [BuildingComponentId.Floor]: 100,
  [BuildingComponentId.Glass]: 100,
};
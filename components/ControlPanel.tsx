
import React from 'react';
import type { BuildingState, BuildingComponentId, MaterialTypeId, DisasterId } from '../types';
import { COMPONENT_CONFIG, DISASTER_CONFIG } from '../constants';
import { BuildingComponentId as BCI, MaterialTypeId as MTI } from '../types';

interface ControlPanelProps {
  buildingState: BuildingState;
  onMaterialChange: (component: BuildingComponentId, material: MaterialTypeId) => void;
  onSimulateDisaster: (disaster: DisasterId) => void;
  onReset: () => void;
  isSimulating: boolean;
  simulationResult: string | null;
}

const MaterialSelector: React.FC<{
  componentId: BuildingComponentId;
  currentMaterial: MaterialTypeId;
  onChange: (material: MaterialTypeId) => void;
  disabled: boolean;
}> = ({ componentId, currentMaterial, onChange, disabled }) => {
  const config = COMPONENT_CONFIG[componentId];
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-amber-300 mb-2">{config.label}</h3>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(config.materials) as MaterialTypeId[]).map((materialId) => {
          const material = config.materials[materialId];
          const isSelected = currentMaterial === materialId;
          return (
            <button
              key={materialId}
              onClick={() => onChange(materialId)}
              disabled={disabled}
              className={`p-2 text-center text-sm rounded-md transition-all duration-200
                ${isSelected ? 'bg-amber-500 text-slate-900 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 hover:bg-slate-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {material.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  buildingState,
  onMaterialChange,
  onSimulateDisaster,
  onReset,
  isSimulating,
  simulationResult,
}) => {
  const isControlsDisabled = isSimulating || !!simulationResult;

  const disasterButtonColors: Record<DisasterId, string> = {
    hurricane: 'bg-slate-600 hover:bg-slate-500',
    tsunami: 'bg-blue-700 hover:bg-blue-600',
    earthquake: 'bg-orange-600 hover:bg-orange-500',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold font-orbitron mb-4 text-white border-b border-slate-700 pb-2">
          Painel de Controle
        </h2>
        
        {Object.keys(COMPONENT_CONFIG).map((key) => {
          const componentId = key as BuildingComponentId;
          return (
            <MaterialSelector
              key={componentId}
              componentId={componentId}
              currentMaterial={buildingState[componentId]}
              onChange={(materialId) => onMaterialChange(componentId, materialId)}
              disabled={isControlsDisabled}
            />
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700">
        {!simulationResult ? (
          <>
            <h2 className="text-2xl font-bold font-orbitron mb-4 text-white">Simular Desastre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(DISASTER_CONFIG) as DisasterId[]).map((disasterId) => {
                const disaster = DISASTER_CONFIG[disasterId];
                return (
                  <button
                    key={disasterId}
                    onClick={() => onSimulateDisaster(disasterId)}
                    disabled={isSimulating}
                    className={`flex items-center justify-center gap-2 p-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:bg-slate-800 disabled:shadow-none disabled:transform-none disabled:cursor-wait ${disasterButtonColors[disasterId]}`}
                  >
                    <disaster.Icon className="text-2xl" />
                    {disaster.label}
                  </button>
                );
              })}
            </div>
            {isSimulating && (
              <div className="text-center mt-4 text-yellow-400 animate-pulse">
                Simulando desastre...
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold font-orbitron mb-2 text-amber-400">Resultado da Simulação</h2>
            <p className="text-lg text-slate-200 mb-4">{simulationResult}</p>
            <button
              onClick={onReset}
              className="w-full p-3 text-lg font-semibold text-slate-900 bg-amber-500 rounded-lg hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Construir Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
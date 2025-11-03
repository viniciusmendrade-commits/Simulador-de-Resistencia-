import React, { useState, useCallback, useMemo } from 'react';
import type { BuildingState, ComponentHealth, DisasterId, BuildingComponentId, MaterialTypeId } from './types';
import { INITIAL_BUILDING_STATE, INITIAL_HEALTH_STATE, COMPONENT_CONFIG, DISASTER_CONFIG } from './constants';
import Building from './components/Building';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [buildingState, setBuildingState] = useState<BuildingState>(INITIAL_BUILDING_STATE);
  const [componentHealth, setComponentHealth] = useState<ComponentHealth>(INITIAL_HEALTH_STATE);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeDisaster, setActiveDisaster] = useState<DisasterId | null>(null);

  const handleMaterialChange = useCallback((component: BuildingComponentId, material: MaterialTypeId) => {
    if (isSimulating || simulationResult) return;
    setBuildingState(prevState => ({
      ...prevState,
      [component]: material,
    }));
  }, [isSimulating, simulationResult]);

  const handleSimulateDisaster = useCallback((disasterId: DisasterId) => {
    setIsSimulating(true);
    setActiveDisaster(disasterId);
    setSimulationResult(null);

    const disaster = DISASTER_CONFIG[disasterId];
    let totalDamage = 0;
    const newHealth: ComponentHealth = { ...componentHealth };

    setTimeout(() => {
      for (const key in buildingState) {
        const componentId = key as BuildingComponentId;
        const materialId = buildingState[componentId];
        const resistance = COMPONENT_CONFIG[componentId].materials[materialId].resistance;
        const damage = Math.max(0, disaster.power - resistance);
        totalDamage += damage;
        newHealth[componentId] = Math.max(0, 100 - damage);
      }

      setComponentHealth(newHealth);
      
      // FIX: Explicitly typing reduce parameters to avoid type inference issues.
      const averageHealth = Object.values(newHealth).reduce((a: number, b: number) => a + b, 0) / Object.keys(newHealth).length;
      
      let resultMessage = '';
      if (averageHealth > 70) {
        resultMessage = 'O edifício resistiu bravamente com danos mínimos!';
      } else if (averageHealth > 50) {
        resultMessage = 'O edifício sofreu danos significativos, mas permaneceu de pé.';
      } else if (averageHealth > 20) {
        resultMessage = 'A estrutura foi severamente comprometida! Risco de colapso.';
      } else {
        resultMessage = 'Colapso total! A estrutura não resistiu ao desastre.';
      }
      
      setSimulationResult(resultMessage);
      setIsSimulating(false);
    }, 2000);
  }, [buildingState, componentHealth]);

  const handleReset = useCallback(() => {
    setBuildingState(INITIAL_BUILDING_STATE);
    setComponentHealth(INITIAL_HEALTH_STATE);
    setSimulationResult(null);
    setIsSimulating(false);
    setActiveDisaster(null);
  }, []);

  const overallHealth = useMemo(() => {
    // FIX: Explicitly typing reduce parameters to fix error where they are inferred as 'unknown'.
    return Object.values(componentHealth).reduce((a: number, b: number) => a + b, 0) / Object.keys(componentHealth).length;
  }, [componentHealth]);

  const getHealthBarColor = (health: number) => {
    if (health > 70) {
      return 'bg-gradient-to-r from-emerald-500 to-green-500';
    }
    if (health > 30) {
      return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    }
    return 'bg-gradient-to-r from-red-600 to-rose-600';
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-amber-400 tracking-wider">
          Simulador de Resiliência de Edifícios
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Construa seu edifício e teste sua resistência contra desastres naturais
        </p>
      </header>
      
      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex-shrink-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800 p-4">
           <div className="w-3/4 mb-4">
              <p className="text-center mb-2 text-sm font-semibold text-slate-300 tracking-wide">Integridade Estrutural</p>
              <div className="w-full bg-slate-800 rounded-full h-4 border border-slate-700">
                  <div 
                      className={`${getHealthBarColor(overallHealth)} h-full rounded-full transition-all duration-500`} 
                      style={{ width: `${overallHealth}%`}}
                  ></div>
              </div>
            </div>
          <Building 
            buildingState={buildingState}
            componentHealth={componentHealth}
            isSimulating={isSimulating}
            activeDisaster={activeDisaster}
          />
        </div>

        <div className="lg:w-1/2 flex-shrink-0 bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800 p-6">
          <ControlPanel
            buildingState={buildingState}
            onMaterialChange={handleMaterialChange}
            onSimulateDisaster={handleSimulateDisaster}
            onReset={handleReset}
            isSimulating={isSimulating}
            simulationResult={simulationResult}
          />
        </div>
      </main>
    </div>
  );
}
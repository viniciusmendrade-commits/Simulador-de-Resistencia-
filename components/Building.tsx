import React, { useState, useEffect, useRef } from 'react';
import type { BuildingState, ComponentHealth, DisasterId } from '../types';
import { BuildingComponentId } from '../types';
import { COMPONENT_CONFIG, DISASTER_CONFIG } from '../constants';

interface BuildingPartProps {
  id: string;
  health: number;
  className: string;
  colorClass: string;
  isAnimating: boolean;
}

const BuildingPart: React.FC<BuildingPartProps> = ({ id, health, className, colorClass, isAnimating }) => {
  const isDestroyed = health <= 0;
  const animationClass = isAnimating ? 'animate-[damage-shake_0.5s_ease-in-out]' : '';

  return (
    <div
      id={id}
      className={`${className} ${isDestroyed ? 'bg-slate-800' : colorClass} ${animationClass} transition-all duration-500`}
      style={{
        boxShadow: health < 100 ? `inset 0 0 15px 5px rgba(0,0,0,0.4)` : 'none',
      }}
    />
  );
};

interface BuildingProps {
  buildingState: BuildingState;
  componentHealth: ComponentHealth;
  isSimulating: boolean;
  activeDisaster: DisasterId | null;
}

const DisasterAnimation: React.FC<{disasterId: DisasterId | null}> = ({ disasterId }) => {
    if (!disasterId) return null;

    const disaster = DISASTER_CONFIG[disasterId];
    const Icon = disaster.Icon;

    let animationClass = '';

    switch (disasterId) {
        case 'tsunami':
            animationClass = 'animate-[tsunami_2s_ease-in-out_forwards]';
            break;
        case 'hurricane':
            animationClass = 'animate-[hurricane_2.5s_ease-in-out_forwards]';
            break;
        case 'earthquake':
            animationClass = 'animate-[earthquake-appear_2s_ease-in-out_forwards]';
            break;
    }

    return (
        <div className={`absolute -inset-10 z-20 flex items-center justify-center overflow-hidden`}>
            <Icon className={`text-9xl ${animationClass}`} />
        </div>
    );
};

const Building: React.FC<BuildingProps> = ({ buildingState, componentHealth, isSimulating, activeDisaster }) => {
  const [animatingParts, setAnimatingParts] = useState<Record<BuildingComponentId, boolean>>({
    [BuildingComponentId.Beams]: false,
    [BuildingComponentId.Roof]: false,
    [BuildingComponentId.Floor]: false,
    [BuildingComponentId.Walls]: false,
    [BuildingComponentId.Glass]: false,
    [BuildingComponentId.Pillars]: false,
  });
  
  const prevHealthRef = useRef<ComponentHealth>(componentHealth);

  useEffect(() => {
    const newAnimatingParts: Partial<Record<BuildingComponentId, boolean>> = {};
    let animationTriggered = false;

    // Compare current health with previous health to detect damage
    for (const key in componentHealth) {
        const componentId = key as BuildingComponentId;
        if (componentHealth[componentId] < prevHealthRef.current[componentId]) {
            newAnimatingParts[componentId] = true;
            animationTriggered = true;
        }
    }

    // If any component took damage, trigger its animation
    if (animationTriggered) {
        setAnimatingParts(prev => ({ ...prev, ...newAnimatingParts }));

        // Reset animation state after the animation duration
        const timer = setTimeout(() => {
            const resetAnimatingParts: Partial<Record<BuildingComponentId, boolean>> = {};
            Object.keys(newAnimatingParts).forEach(key => {
                resetAnimatingParts[key as BuildingComponentId] = false;
            });
            setAnimatingParts(prev => ({ ...prev, ...resetAnimatingParts }));
        }, 400); // Must match animation duration

        return () => clearTimeout(timer);
    }
    
    // Always update the ref to the latest health for the next render
    prevHealthRef.current = componentHealth;

  }, [componentHealth]);

  const getPartProps = (id: BuildingComponentId) => ({
    id: id,
    health: componentHealth[id],
    colorClass: COMPONENT_CONFIG[id].materials[buildingState[id]].color,
    isAnimating: animatingParts[id],
  });

  const buildingShakeClass = isSimulating && activeDisaster === 'earthquake' ? 'animate-[shake_0.4s_4_1s]' : '';
  const numberOfFloors = 7;

  const windowStyle = {
    backgroundImage: 'radial-gradient(rgba(252, 211, 77, 0.7) 1px, transparent 1px)',
    backgroundSize: '8px 8px',
  };

  const buildingStyle1 = {
    backgroundColor: '#1e293b', // slate-800
    ...windowStyle,
  };

  const buildingStyle2 = {
    backgroundColor: '#0f172a', // slate-900
    ...windowStyle,
  };

  return (
    <div className="w-full aspect-square max-w-[400px] md:max-w-[500px] relative flex items-end justify-center rounded-xl overflow-hidden">
        {/* Background Scene */}
        <div className="absolute inset-0 z-0">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-slate-950" />
            
            {/* Cityscape Silhouettes - Split into two sides */}
            {/* Left Side Cityscape */}
            <div className="absolute bottom-0 left-0 w-1/4 h-2/3">
                 <div className="absolute bottom-0 left-[0%] w-[25%] h-[40%]" style={buildingStyle1} />
                 <div className="absolute bottom-0 left-[15%] w-[30%] h-[53%]" style={buildingStyle2} />
                 <div className="absolute bottom-0 left-[40%] w-[20%] h-[37%]" style={buildingStyle1} />
                 <div className="absolute bottom-0 left-[55%] w-[35%] h-[47%]" style={buildingStyle2} />
                 <div className="absolute bottom-0 left-[75%] w-[25%] h-[63%]" style={buildingStyle1} />
            </div>

            {/* Right Side Cityscape */}
            <div className="absolute bottom-0 right-0 w-1/4 h-2/3">
                <div className="absolute bottom-0 right-[0%] w-[25%] h-[43%]" style={buildingStyle1} />
                <div className="absolute bottom-0 right-[15%] w-[30%] h-[57%]" style={buildingStyle2} />
                <div className="absolute bottom-0 right-[40%] w-[20%] h-[33%]" style={buildingStyle1} />
                <div className="absolute bottom-0 right-[55%] w-[35%] h-[50%]" style={buildingStyle2} />
                <div className="absolute bottom-0 right-[75%] w-[25%] h-[67%]" style={buildingStyle1} />
            </div>
        </div>
      
        {isSimulating && <DisasterAnimation disasterId={activeDisaster} />}
        <div className={`relative w-[50%] h-[85%] ${buildingShakeClass} z-10`}>
        
        {/* Structure */}
        <div className="absolute inset-0 flex flex-col">
            {/* Roof */}
            <BuildingPart {...getPartProps(BuildingComponentId.Roof)} className="h-[6%] w-full" />
            <BuildingPart {...getPartProps(BuildingComponentId.Beams)} className="h-[2%] w-full" />
            
            {/* Floors */}
            {Array.from({ length: numberOfFloors }).map((_, index) => (
                <div key={index} className="flex-grow flex flex-col">
                    <div className="flex-grow flex">
                        <BuildingPart {...getPartProps(BuildingComponentId.Walls)} className="w-[10%] h-full" />
                        <BuildingPart {...getPartProps(BuildingComponentId.Pillars)} className="w-[8%] h-full" />
                        <BuildingPart {...getPartProps(BuildingComponentId.Glass)} className="flex-grow h-full" />
                        <BuildingPart {...getPartProps(BuildingComponentId.Pillars)} className="w-[8%] h-full" />
                        <BuildingPart {...getPartProps(BuildingComponentId.Walls)} className="w-[10%] h-full" />
                    </div>
                     {/* Render floor slab and beam for intermediate floors */}
                    {index < numberOfFloors - 1 && (
                         <>
                            <BuildingPart {...getPartProps(BuildingComponentId.Floor)} className="h-[2%] w-full" />
                            <BuildingPart {...getPartProps(BuildingComponentId.Beams)} className="h-[2%] w-full" />
                         </>
                    )}
                </div>
            ))}
            
            {/* Foundation */}
            <BuildingPart {...getPartProps(BuildingComponentId.Floor)} className="h-[5%] w-full" />
        </div>
      </div>
       <style>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            @keyframes damage-shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
                40%, 60% { transform: translate3d(2px, 0, 0); }
            }
            @keyframes tsunami {
                0% { transform: translateY(250px) scale(1); opacity: 0; }
                60% { transform: translateY(-50px) scale(1.3); opacity: 1; }
                100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
            }
             @keyframes hurricane {
                0% { transform: translateX(-300px) rotate(-180deg) scale(0.8); opacity: 0.8; }
                50% { transform: translateX(0px) rotate(0deg) scale(1.2); opacity: 1; }
                100% { transform: translateX(300px) rotate(180deg) scale(0.8); opacity: 0; }
            }
            @keyframes earthquake-appear {
                0% { 
                    opacity: 0; 
                    transform: scale(0.7); 
                }
                30% { 
                    opacity: 1; 
                    transform: scale(1.05); 
                }
                70% { 
                    opacity: 1; 
                    transform: scale(1.0); 
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.7); 
                }
            }
        `}</style>
    </div>
  );
};

export default Building;
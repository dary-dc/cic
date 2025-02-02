import React from 'react'
import "../style-sheets/DeviceNotSupported.css";
import { MobileSvg } from './svg_components/MobileSvg';
import { TabletSvg } from './svg_components/TabletSvg';
import { LaptopSvg } from './svg_components/LaptopSvg';

export const DeviceNotSupported = () => {
  return (
    <div className='device-not-supported-main-container'>
        <div className='device-not-supported-title'>
            Lo sentimos, este sitio no soporta la resolución actual por el momento
        </div>
        <div className='device-not-supported-subtitle'>
            Soporte en Dispositivos:
        </div>
        <div className='full-width device-not-supported-container-cards'>    
            <div className="flex-container container-cards spaced-components">
                <div className="card ">
                    <div className="flex-container column-flex extra-gap ">
                        <MobileSvg/>
                        <div className="device-not-supported-grid-two-columns">
                            <span>Dispositivo:</span>
                            <span>Celular</span>
                            
                            <span>Soportado:</span>
                            <span className='not-supported-category'>No</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-container container-cards spaced-components">
                <div className="card ">
                    <div className="flex-container column-flex extra-gap ">
                        <TabletSvg/>
                        <div className="device-not-supported-grid-two-columns">
                            <span>Dispositivo:</span>
                            <span>Tablet</span>
                            
                            <span>Soportado:</span>
                            <span className='not-supported-category'>No</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-container container-cards spaced-components">
                <div className="card ">
                    <div className="flex-container column-flex extra-gap ">
                        <LaptopSvg/>
                        <div className="device-not-supported-grid-two-columns">
                            <span>Dispositivo:</span>
                            <span>Ordenador</span>
                            
                            <span>Soportado:</span>
                            <span className='supported-category'>Sí</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
